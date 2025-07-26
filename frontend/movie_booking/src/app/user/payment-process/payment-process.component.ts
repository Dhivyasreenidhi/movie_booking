import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payment-process',
  imports: [CommonModule,FormsModule],
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.css']
})
export class PaymentProcessComponent implements OnInit {
  showPayment = true;
  showConfirmation = false;
  isProcessing = false;
  timerMinutes = 5;
  timerSeconds = 0;
  paymentMethod = '';
  upiId = '';
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  bank = '';
  bookingId = '';
  bookingInfo: any = {};

  ngOnInit() {
    const data = localStorage.getItem('bookingInfo');
    if (data) {
      this.bookingInfo = JSON.parse(data);
    }
    this.startTimer();
  }

  selectPaymentMethod(method: string) {
    this.paymentMethod = method;
  }

  startTimer() {
    const interval = setInterval(() => {
      if (this.timerSeconds === 0) {
        if (this.timerMinutes === 0) {
          clearInterval(interval);
        } else {
          this.timerMinutes--;
          this.timerSeconds = 59;
        }
      } else {
        this.timerSeconds--;
      }
    }, 1000);
  }

  processPayment() {
    this.isProcessing = true;
    setTimeout(() => {
      this.bookingId = 'BK' + Math.floor(100000 + Math.random() * 900000);
      this.showPayment = false;
      this.showConfirmation = true;
    }, 3000);
  }
}
