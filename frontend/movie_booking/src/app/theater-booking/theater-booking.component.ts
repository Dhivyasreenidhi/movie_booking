import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-theater-booking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theater-booking.component.html',
  styleUrls: ['./theater-booking.component.css']
})
export class TheaterBookingComponent {
  theater = {
    name: 'KG Cinemas',
    location: 'Race Course, Coimbatore',
    distance: '0.6 km',
    screens: [
      {
        name: 'Screen 1',
        type: '2D | Dolby Atmos',
        showtimes: ['10:30 AM', '1:45 PM', '4:30 PM', '8:15 PM']
      },
      {
        name: 'Screen 2',
        type: '2D | DTS:X',
        showtimes: ['11:00 AM', '2:30 PM', '6:45 PM', '9:30 PM']
      }
    ]
  };

  selectedScreen: any = null;
  selectedTime: string = '';
  showSeatSelection = false;
  seats = Array.from({ length: 40 }, (_, i) => ({ number: i + 1, selected: false, occupied: Math.random() > 0.8 }));
  selectedSeats: number[] = [];
  ticketPrice = 250;
  showPayment = false;
  paymentMethod: string = 'upi';
  upiId: string = '';
  cardNumber: string = '';
  cardExpiry: string = '';
  cardCvv: string = '';
  bank: string = '';
  isProcessing = false;
  showConfirmation = false;
  bookingId: string = '';

  openSeatSelection(screen: any, time: string) {
    this.selectedScreen = screen;
    this.selectedTime = time;
    this.showSeatSelection = true;
    this.selectedSeats = [];
    this.seats.forEach(seat => seat.selected = false);
  }

  toggleSeat(seat: any) {
    if (!seat.occupied) {
      seat.selected = !seat.selected;
      this.selectedSeats = this.seats.filter(s => s.selected).map(s => s.number);
    }
  }

  proceedToPayment() {
    if (this.selectedSeats.length === 0) return;
    this.showSeatSelection = false;
    this.showPayment = true;
  }

  selectPaymentMethod(method: string) {
    this.paymentMethod = method;
    this.upiId = '';
    this.cardNumber = '';
    this.cardExpiry = '';
    this.cardCvv = '';
    this.bank = '';
  }

  processPayment() {
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
      this.showPayment = false;
      this.showConfirmation = true;
      this.bookingId = 'B' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }, 2000);
  }

  closeConfirmation() {
    this.showConfirmation = false;
  }
}
