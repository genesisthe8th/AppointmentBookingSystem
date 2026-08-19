package com.example.demo.service;

import com.example.demo.domain.Appointment;
import com.example.demo.domain.Branch;
import com.example.demo.domain.Customer;
import com.example.demo.dto.AppointmentRequest;
import com.example.demo.exception.DoubleBookingException;
import com.example.demo.repository.AppointmentRepository;
import com.example.demo.repository.BranchRepository;
import com.example.demo.repository.CustomerRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final AppointmentRepository appointmentRepository;
    private final BranchRepository branchRepository;
    private final CustomerRepository customerRepository;

    public BookingService(AppointmentRepository appointmentRepository,
                          BranchRepository branchRepository,
                          CustomerRepository customerRepository) {
        this.appointmentRepository = appointmentRepository;
        this.branchRepository = branchRepository;
        this.customerRepository = customerRepository;
    }

    @Transactional
    public Appointment createAppointment(AppointmentRequest request) {
        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid branch ID"));

        Customer customer = new Customer(request.getCustomerFullName(), request.getCustomerEmail(), request.getCustomerPhone());
        customer = customerRepository.save(customer);

        Appointment appointment = new Appointment(branch, customer, request.getSlotTime(), "BOOKED");

        try {
            return appointmentRepository.save(appointment);
        } catch (DataIntegrityViolationException e) {
            // This exception is thrown when the unique constraint (branch_id, slot_time) is violated
            throw new DoubleBookingException("The requested slot is already booked.");
        }
    }

    public List<LocalDateTime> getAvailableSlots(Long branchId, LocalDate date) {
        LocalDateTime startOfDay = date.atTime(LocalTime.of(9, 0)); // 9 AM
        LocalDateTime endOfDay = date.atTime(LocalTime.of(17, 0)); // 5 PM

        List<Appointment> existingAppointments = appointmentRepository.findByBranchIdAndSlotTimeBetween(branchId, startOfDay, endOfDay);
        List<LocalDateTime> bookedSlots = existingAppointments.stream()
                .map(Appointment::getSlotTime)
                .collect(Collectors.toList());

        List<LocalDateTime> availableSlots = new ArrayList<>();
        LocalDateTime currentSlot = startOfDay;
        while (currentSlot.isBefore(endOfDay)) {
            if (!bookedSlots.contains(currentSlot)) {
                availableSlots.add(currentSlot);
            }
            currentSlot = currentSlot.plusHours(1); // 1 hour slots
        }
        return availableSlots;
    }
}
