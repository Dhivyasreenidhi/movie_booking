import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-date-screen-selection',
  standalone: true, // Add this if using standalone components
  imports: [CommonModule],
  templateUrl: './date-screen-selection.component.html',
  styleUrls: ['./date-screen-selection.component.css']
})
export class DateScreenSelectionComponent {
  @Input() currentStep: number = 1; // Add this
  @Input() selectedDate: any = null; // Add this
  @Input() selectedScreen: any = null; // Add this
  @Input() dates: any[] = [];
  @Input() screens: any[] = [];
  @Output() dateSelected = new EventEmitter<any>();
  @Output() screenSelected = new EventEmitter<any>();

  selectDate(date: any): void {
    this.selectedDate = date.value; // Update selectedDate when date is selected
    this.dateSelected.emit(date);
  }

  selectScreen(screen: any): void {
    this.selectedScreen = screen.id; // Update selectedScreen when screen is selected
    this.screenSelected.emit(screen);
  }

  getFeatureClass(feature: string): string {
    const classes: {[key: string]: string} = {
      '3D': 'bg-yellow-500 text-black',
      'Dolby': 'bg-purple-500 text-white',
      'Laser': 'bg-red-500 text-white'
    };
    return classes[feature] || 'bg-gray-500 text-white';
  }
}