import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

interface Theater {
  name: string;
  location: string;
  showtimes: string[];
}

interface DateOption {
  date: string;
  day: string;
  month: string;
  active: boolean;
}
@Component({
  selector: 'app-showtime-selectionss',
  imports: [CommonModule],
  templateUrl: './showtime-selectionss.component.html',
  styleUrl: './showtime-selectionss.component.css'
})
export class ShowtimeSelectionssComponent {
@Input() dates: DateOption[] = [];
  @Input() theaters: Theater[] = [];
  
  @Output() showtimeSelected = new EventEmitter<{theater: string, time: string}>();
  @Output() dateSelected = new EventEmitter<DateOption>();

  selectDate(date: DateOption) {
    this.dates.forEach(d => d.active = false);
    date.active = true;
    this.dateSelected.emit(date);
  }

  openSeatSelection(theater: string, time: string) {
    this.showtimeSelected.emit({ theater, time });
  }
}