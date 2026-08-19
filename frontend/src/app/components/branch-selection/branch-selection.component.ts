import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService, Branch } from '../../services/api.service';

@Component({
  selector: 'app-branch-selection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branch-selection.component.html',
  styleUrls: ['./branch-selection.component.scss']
})
export class BranchSelectionComponent implements OnInit {
  branches: Branch[] = [];
  isLoading = true;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.apiService.getBranches().subscribe({
      next: (data) => {
        this.branches = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load branches', err);
        this.isLoading = false;
      }
    });
  }

  selectBranch(branchId: number): void {
    this.router.navigate(['/slots', branchId]);
  }
}
