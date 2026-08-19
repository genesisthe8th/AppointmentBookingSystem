import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Branch {
  id: number;
  name: string;
  address: string;
  timezone: string;
}

export interface AppointmentRequest {
  branchId: number;
  customerFullName: string;
  customerEmail: string;
  customerPhone: string;
  slotTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.baseUrl}/branches`);
  }

  getAvailableSlots(branchId: number, date: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/branches/${branchId}/slots?date=${date}`);
  }

  createAppointment(request: AppointmentRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/appointments`, request);
  }
}
