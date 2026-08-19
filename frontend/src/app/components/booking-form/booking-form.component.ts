import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, AppointmentRequest } from '../../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit {
  bookingForm!: FormGroup;
  branchId!: number;
  slotTime!: string;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.branchId = Number(this.route.snapshot.paramMap.get('branchId'));
    this.slotTime = this.route.snapshot.paramMap.get('slot') || '';

    this.bookingForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.bookingForm.invalid) return;

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const request: AppointmentRequest = {
      branchId: this.branchId,
      slotTime: this.slotTime,
      customerFullName: this.bookingForm.value.fullName,
      customerEmail: this.bookingForm.value.email,
      customerPhone: this.bookingForm.value.phone
    };

    this.apiService.createAppointment(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Appointment successfully booked!';
        setTimeout(() => this.router.navigate(['/']), 3000);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        if (err.status === 409) {
          this.errorMessage = 'Oh no! Someone just booked this exact slot. Please go back and select another time.';
        } else {
          this.errorMessage = 'An error occurred while booking. Please try again.';
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/slots', this.branchId]);
  }
}
