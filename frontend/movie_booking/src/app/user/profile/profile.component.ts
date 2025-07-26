import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeadersComponent } from '../headers/headers.component';
import { FootersComponent } from '../footers/footers.component';
import { format } from 'date-fns';
import { EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { BookingManagementComponent } from '../booking-management/booking-management.component';

interface User {
  name: string;
  email: string;
  phone: string;
  fullName: string;
  gender: string;
  maritalStatus: string;
  dateOfBirth: string;
}

interface ShowDate {
  day: string;
  date: number;
  month: string;
}

interface Booking {
  id: string;
  movieTitle: string;
  theaterName: string;
  showtime: string;
  showDate: ShowDate;
  seats: number[];
  ticketPrice: number;
  bookingTime: Date;
  cancellationDeadline: Date;
  isCancelled: boolean;
  refundProcessed: boolean;
}

@Component({
  selector: 'app-profile',
  imports:[CommonModule,FormsModule,HeadersComponent,FootersComponent,BookingManagementComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  isEditing = false;
  originalUser: User;
  editableUser: User;

  @Input() booking: Booking | null = null;
  @Output() close = new EventEmitter<void>();


  showCancellationModal = false;
  bookingHistory: Booking[] = [];

  user: User = {
    name: 'Dhivyasreenidhi Durai',
    email: 'dhivyasreenidhidurai@gmail.com',
    phone: '956838302',
    fullName: 'Dhivyasreenidhi Durai',
    gender: 'Female',
    maritalStatus: 'Unmarried',
    dateOfBirth: '2004-02-13'
  };

  constructor(private router: Router) {
    this.originalUser = {...this.user};
    this.editableUser = {...this.user};
  }

  

navigateToBookingManagement() {
  this.router.navigate(['/booking-management']);
}

  startEditing() {
    this.isEditing = true;
    this.editableUser = {...this.user};
  }

  cancelEditing() {
    this.isEditing = false;
  }

  saveChanges() {
    if (confirm('Are you sure you want to save these changes?')) {
      this.user = {...this.editableUser};
      this.isEditing = false;
      alert('Changes saved successfully!');
    }
  }

  logout() {
    if (confirm('Are you sure you want to logout?')) {
      // In a real app, you would also clear authentication tokens, etc.
      this.router.navigate(['/login']);
    }
  }

  completeBooking() {
    const newBooking: Booking = {
      id: 'BK-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
      movieTitle: '3BHK',
      theaterName: 'KGCinemas - Forum Mall',
      showtime: '10:30 AM',
      showDate: { day: 'Mon', date: 15, month: 'Jan' },
      seats: [5, 6],
      ticketPrice: 250,
      bookingTime: new Date(),
      cancellationDeadline: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
      isCancelled: false,
      refundProcessed: false,
    };
    this.booking = newBooking;
    this.bookingHistory.push(newBooking);
  }
}