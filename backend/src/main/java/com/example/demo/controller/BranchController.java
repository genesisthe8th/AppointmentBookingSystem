package com.example.demo.controller;

import com.example.demo.domain.Branch;
import com.example.demo.repository.BranchRepository;
import com.example.demo.service.BookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchRepository branchRepository;
    private final BookingService bookingService;

    public BranchController(BranchRepository branchRepository, BookingService bookingService) {
        this.branchRepository = branchRepository;
        this.bookingService = bookingService;
    }

    @GetMapping
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    @GetMapping("/{id}/slots")
    public List<LocalDateTime> getAvailableSlots(
            @PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return bookingService.getAvailableSlots(id, date);
    }
}
