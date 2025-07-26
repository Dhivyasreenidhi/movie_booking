import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { format } from 'date-fns';
import { HeadersComponent } from '../headers/headers.component';
import { FootersComponent } from '../footers/footers.component';

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
  selector: 'app-booking-management',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf,HeadersComponent,FootersComponent],
  templateUrl: './booking-management.component.html',
})
export class BookingManagementComponent {
  @Input() booking: Booking | null = null;
  @Output() close = new EventEmitter<void>();
  showCancellationModal = false;
  bookingHistory: Booking[] = [];

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

  getBookingStatus(): string {
    if (!this.booking) return 'No Booking';
    if (this.booking.isCancelled) return 'Cancelled';
    if (this.isShowOver()) return 'Show Over';
    return 'Confirmed';
  }

  canCancel(): boolean {
    if (!this.booking) return false;
    return (
      !this.booking.isCancelled &&
      new Date() < new Date(this.booking.cancellationDeadline)
    );
  }

  isShowOver(): boolean {
    if (!this.booking) return false;
    const showDateTime = new Date(
      `${this.booking.showDate.month} ${this.booking.showDate.date}, ${new Date().getFullYear()} ${this.booking.showtime}`
    );
    return new Date() > showDateTime;
  }

  getCancellationDeadline(): Date | null {
    return this.booking ? this.booking.cancellationDeadline : null;
  }

  downloadTicket() {
    if (!this.booking) return;
    const ticketContent = this.generateTicketContent();
    const blob = new Blob([ticketContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${this.booking.id}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  sendToEmail() {
    if (!this.booking) return;
    // Simulate email sending
    console.log('Sending ticket to email...');
    alert(`Ticket has been sent to your registered email for booking ${this.booking.id}`);
  }

  openCancelModal() {
    this.showCancellationModal = true;
  }

  confirmCancellation() {
    if (!this.booking) return;
    this.booking.isCancelled = true;
    this.booking.refundProcessed = true;
    const refundAmount = this.booking.seats.length * this.booking.ticketPrice;
    alert(`Booking cancelled! Refund of ₹${refundAmount} will be processed within 5-7 business days.`);
    this.showCancellationModal = false;
  }

  private generateTicketContent(): string {
    if (!this.booking) return '';
    return `
      ===== TICKET =====
      Movie: ${this.booking.movieTitle}
      Theater: ${this.booking.theaterName}
      Date: ${this.booking.showDate.day}, ${this.booking.showDate.date} ${this.booking.showDate.month}
      Time: ${this.booking.showtime}
      Seats: ${this.booking.seats.join(', ')}
      Booking ID: ${this.booking.id}
      Amount: ₹${this.booking.seats.length * this.booking.ticketPrice}
      Booking Time: ${format(this.booking.bookingTime, 'PPpp')}
      ==================
    `;
  }

  closeManagement() {
    this.close.emit();
  }
}