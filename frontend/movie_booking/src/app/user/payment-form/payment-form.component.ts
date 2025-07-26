import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, FormsModule, OrderSummaryComponent],
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent {
  @Input() selectedSeats: any[] = [];
  @Input() selectedConcessions: any[] = [];
  @Input() totalPrice: number = 0;
  @Output() paymentSubmitted = new EventEmitter<void>();

  currentStep: number = 3; // Added to fix NG9: Property 'currentStep' does not exist
  selectedDateLabel: string = 'July 10, 2025'; // Added to fix NG9: Property 'selectedDateLabel' does not exist
  selectedTime: string = '7:00 PM'; // Added to fix NG9: Property 'selectedTime' does not exist
  selectedScreen: string = 'Screen 1'; // Added to fix NG9: Property 'selectedScreen' does not exist
  subtotal: number = 0; // Added to fix NG9: Property 'subtotal' does not exist
  promoCode: string = ''; // Added to fix NG9: Property 'promoCode' does not exist

  bookingData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    paymentMethod: 'credit',
    promoCode: '',
    termsAccepted: false
  };

  paymentDetails = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  };

  paymentMethods = [
    { value: 'credit', label: 'Credit Card', icon: 'far fa-credit-card' },
    { value: 'debit', label: 'Debit Card', icon: 'fas fa-credit-card' },
    { value: 'paypal', label: 'PayPal', icon: 'fab fa-paypal' },
    { value: 'wallet', label: 'Digital Wallet', icon: 'fas fa-wallet' }
  ];

  paymentLogos = [
    { src: 'assets/visa.png', alt: 'Visa' },
    { src: 'assets/mastercard.png', alt: 'Mastercard' },
    { src: 'assets/paypal.png', alt: 'PayPal' },
    { src: 'assets/apple-pay.png', alt: 'Apple Pay' }
  ];

  terms = [
    'Tickets are non-refundable but can be exchanged up to 2 hours before showtime for a fee.',
    'Latecomers may not be admitted until a suitable break in the performance.',
    'Children under 13 must be accompanied by an adult for this UA13+ rated film.',
    'Food and drinks purchased externally are not permitted in the cinema.',
    'We reserve the right to refuse admission.',
    'In case of technical difficulties, we will offer an alternative screening or refund.'
  ];

  promoApplied = false;
  promoDiscount = 0;
  promoError = '';
  loyaltyPoints = 1500;
  loyaltyPointsUsed = 0;
  useLoyaltyPoints = false;
  isProcessingPayment = false;

  // Added min method to fix NG9: Property 'min' does not exist
  min(a: number, b: number): number {
    return Math.min(a, b);
  }

  showCreditCardForm(): boolean {
    return this.bookingData.paymentMethod === 'credit' || this.bookingData.paymentMethod === 'debit';
  }

  showPaymentRedirectNotice(): boolean {
    return this.bookingData.paymentMethod === 'paypal' || this.bookingData.paymentMethod === 'wallet';
  }

  getPaymentMethodName(method: string): string {
    const paymentMethod = this.paymentMethods.find(p => p.value === method);
    return paymentMethod ? paymentMethod.label : '';
  }

  applyPromoCode(): void {
    if (!this.bookingData.promoCode) {
      this.promoError = 'Please enter a promo code';
      return;
    }

    const validPromos = ['MOVIE20', 'SUMMER15', 'KG10'];
    const promoCodeUpper = this.bookingData.promoCode.toUpperCase();
    if (validPromos.includes(promoCodeUpper)) {
      this.promoApplied = true;
      this.promoError = '';
      this.promoDiscount = 100; // Fixed
      this.promoCode = promoCodeUpper; // Update component-level promoCode
    } else {
      this.promoApplied = false;
      this.promoError = 'Invalid promo code';
      this.promoDiscount = 0;
      this.promoCode = '';
    }
  }

  updateLoyaltyPointsUsage(): void {
    if (!this.useLoyaltyPoints) {
      this.loyaltyPointsUsed = 0;
    } else {
      const maxPoints = this.min(this.loyaltyPoints, this.totalPrice * 100);
      this.loyaltyPointsUsed = this.min(this.loyaltyPointsUsed, maxPoints);
    }
  }

  onSubmit(): void { // Removed bookingForm parameter to fix NG4: Expected 0 arguments
    this.isProcessingPayment = true;
    this.paymentSubmitted.emit();
  }

  toggleChat(): void {
    // Implement chat toggle logic
  }
}