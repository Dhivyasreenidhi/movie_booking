import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Add this import

@Component({
  selector: 'app-showtime-selection',
  standalone: true, // Add if using standalone components
  imports: [CommonModule], // Add this to use currency pipe
  templateUrl: './showtime-selection.component.html',
  styleUrls: ['./showtime-selection.component.css']
})
export class ShowtimeSelectionComponent {
  @Input() currentStep: number = 1; // Add this input
  @Input() selectedTime: string | null = null; // Add this input
  @Input() showtimes: any[] = [];
  @Output() timeSelected = new EventEmitter<any>();
  
  timeFilter = 'all';
  timeFilters = [
    { value: 'all', label: 'All Times' },
    { value: 'morning', label: 'Morning (6AM-12PM)' },
    { value: 'afternoon', label: 'Afternoon (12PM-5PM)' },
    { value: 'evening', label: 'Evening (5PM-12AM)' }
  ];

  get filteredShowtimes(): any[] {
    if (this.timeFilter === 'all') return this.showtimes;
    
    return this.showtimes.filter(time => {
      const timeStr = time.time;
      const [hoursStr, period] = timeStr.split(' ');
      const hours = parseInt(hoursStr.split(':')[0]);
      
      if (this.timeFilter === 'morning') {
        return period === 'AM' && hours >= 6 && hours < 12;
      } else if (this.timeFilter === 'afternoon') {
        return (period === 'PM' && hours < 5) || 
               (hours === 12 && period === 'PM');
      } else if (this.timeFilter === 'evening') {
        return period === 'PM' && hours >= 5;
      }
      return true;
    });
  }

  selectShowtime(time: any): void {
    this.selectedTime = time.time; // Update selectedTime when time is selected
    this.timeSelected.emit(time);
  }

  filterShowtimes(filter: string): void {
    this.timeFilter = filter;
  }
}