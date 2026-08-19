import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-slot-selection',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './slot-selection.component.html',
  styleUrls: ['./slot-selection.component.scss']
})
export class SlotSelectionComponent implements OnInit {
  branchId!: number;
  selectedDate: string;
  slots: string[] = [];
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {
    // Default to today
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.branchId = Number(this.route.snapshot.paramMap.get('branchId'));
    this.fetchSlots();
  }

  fetchSlots(): void {
    if (!this.selectedDate) return;
    this.isLoading = true;
    this.apiService.getAvailableSlots(this.branchId, this.selectedDate).subscribe({
      next: (data) => {
        this.slots = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load slots', err);
        this.isLoading = false;
      }
    });
  }

  onDateChange(): void {
    this.fetchSlots();
  }

  selectSlot(slot: string): void {
    this.router.navigate(['/book', this.branchId, slot]);
  }
}
