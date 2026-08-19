package com.example.demo.repository;

import com.example.demo.domain.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByBranchIdAndSlotTimeBetween(Long branchId, LocalDateTime start, LocalDateTime end);
}
