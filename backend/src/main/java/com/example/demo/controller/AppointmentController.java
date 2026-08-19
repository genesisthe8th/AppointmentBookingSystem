package com.example.demo.controller;

import com.example.demo.domain.Appointment;
import com.example.demo.dto.AppointmentRequest;
import com.example.demo.service.BookingService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final BookingService bookingService;

    public AppointmentController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Appointment createAppointment(@RequestBody AppointmentRequest request) {
        return bookingService.createAppointment(request);
    }
}
