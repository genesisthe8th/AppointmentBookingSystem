# Stage 1: Build Angular frontend
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build -- --configuration production

# Stage 2: Build Spring Boot backend
FROM eclipse-temurin:21-jdk AS backend-build
WORKDIR /app/backend
# Copy maven wrapper and pom.xml
COPY backend/mvnw .
COPY backend/.mvn .mvn
COPY backend/pom.xml .
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy backend source code
COPY backend/src src

# Copy the built Angular app into the Spring Boot static resources folder
RUN mkdir -p src/main/resources/static
# Angular 17+ with application builder outputs browser files into `dist/frontend/browser/`
# We use a wildcard fallback in case it outputs directly to `dist/frontend/`
RUN cp -r /app/frontend/dist/frontend/browser/* src/main/resources/static/ || cp -r /app/frontend/dist/frontend/* src/main/resources/static/

# Build the jar
RUN ./mvnw clean package -DskipTests

# Stage 3: Create the final runnable image
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=backend-build /app/backend/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
