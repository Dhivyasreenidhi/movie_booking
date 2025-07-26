import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-booking-steps',
  imports:[CommonModule],
  templateUrl: './booking-steps.component.html',
  styleUrls: ['./booking-steps.component.css']
})
export class BookingStepsComponent {
  @Input() currentStep: number = 1;
}