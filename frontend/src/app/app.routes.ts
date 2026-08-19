import { Routes } from '@angular/router';
import { BranchSelectionComponent } from './components/branch-selection/branch-selection.component';
import { SlotSelectionComponent } from './components/slot-selection/slot-selection.component';
import { BookingFormComponent } from './components/booking-form/booking-form.component';

export const routes: Routes = [
  { path: '', component: BranchSelectionComponent },
  { path: 'slots/:branchId', component: SlotSelectionComponent },
  { path: 'book/:branchId/:slot', component: BookingFormComponent },
  { path: '**', redirectTo: '' }
];
