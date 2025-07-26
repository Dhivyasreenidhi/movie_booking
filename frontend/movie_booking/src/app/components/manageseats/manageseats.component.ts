import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';




interface Seat {
  number: string;
  row: string;
  isBlocked: boolean;
  isSelected: boolean;
}

interface Show {
  id: number;
  movieTitle: string;
  theaterName: string;
  date: string;
  time: string;
  seats: Seat[];
}

@Component({
  selector: 'app-manageseats',
  imports: [FormsModule,CommonModule,RouterModule,SidebarComponent,NavBarComponent,ManageseatsComponent],
  templateUrl: './manageseats.component.html',
  styleUrl: './manageseats.component.css'
})
export class ManageseatsComponent {
  shows: Show[] = [
    {
      id: 1,
      movieTitle: 'Avengers: Endgame',
      theaterName: 'Screen 1',
      date: '2023-12-25',
      time: '18:30',
      seats: this.generateSeats(10, 10)
    },
    {
      id: 2,
      movieTitle: 'The Batman',
      theaterName: 'IMAX',
      date: '2023-12-25',
      time: '21:00',
      seats: this.generateSeats(8, 12)
    }
  ];

  selectedShow: Show | null = null;
  allSelected: boolean = false;

  private generateSeats(rows: number, seatsPerRow: number): Seat[] {
    const seats: Seat[] = [];
    const rowLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    for (let r = 0; r < rows; r++) {
      for (let s = 1; s <= seatsPerRow; s++) {
        seats.push({
          row: rowLetters[r],
          number: `${rowLetters[r]}${s}`,
          isBlocked: false,
          isSelected: false
        });
      }
    }
    return seats;
  }

  selectShow(show: Show): void {
    this.selectedShow = show;
    this.allSelected = false;
  }

  toggleSeatSelection(seat: Seat): void {
    seat.isSelected = !seat.isSelected;
    this.updateSelectAllState();
  }

  toggleSeatBlocking(seat: Seat): void {
    seat.isBlocked = !seat.isBlocked;
    seat.isSelected = false;
    this.allSelected = false;
  }

  toggleSelectAll(): void {
    if (!this.selectedShow) return;
    
    this.allSelected = !this.allSelected;
    this.selectedShow.seats.forEach(seat => {
      seat.isSelected = this.allSelected;
    });
  }

  blockSelectedSeats(): void {
    if (!this.selectedShow) return;
    
    this.selectedShow.seats.forEach(seat => {
      if (seat.isSelected) {
        seat.isBlocked = true;
        seat.isSelected = false;
      }
    });
    this.allSelected = false;
  }

  unblockSelectedSeats(): void {
    if (!this.selectedShow) return;
    
    this.selectedShow.seats.forEach(seat => {
      if (seat.isSelected) {
        seat.isBlocked = false;
        seat.isSelected = false;
      }
    });
    this.allSelected = false;
  }

  private updateSelectAllState(): void {
    if (!this.selectedShow) {
      this.allSelected = false;
      return;
    }
    this.allSelected = this.selectedShow.seats.every(seat => seat.isSelected);
  }

  getBlockedSeatsCount(): number {
    if (!this.selectedShow) return 0;
    return this.selectedShow.seats.filter(s => s.isBlocked).length;
  }

  getSelectedSeatsCount(): number {
    if (!this.selectedShow) return 0;
    return this.selectedShow.seats.filter(s => s.isSelected).length;
  }
}