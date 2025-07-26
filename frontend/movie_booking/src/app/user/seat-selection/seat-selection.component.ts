import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderSummaryComponent } from '../order-summary/order-summary.component';

interface Seat {
  id: string;
  type: 'standard' | 'premium' | 'accessible';
  price: number;
  available: boolean;
  selected: boolean;
}

interface Concession {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, OrderSummaryComponent],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent {
  @Input() currentStep: number = 2;
  @Input() seats: any[] = [];
  @Input() selectedSeats: any[] = [];
  @Input() concessionItems: any[] = [];
  @Input() selectedDateLabel: string = '';
  @Input() selectedTime: string = '';
  @Input() selectedScreen: number = 0; // Change to number
  @Input() selectedConcessions: any[] = [];
  @Input() subtotal: number = 0;
  @Input() promoApplied: boolean = false;
  @Input() promoCode: string = '';
  @Input() promoDiscount: number = 0;
  @Input() loyaltyPointsUsed: number = 0;
  @Input() totalPrice: number = 0;
  
  @Output() seatToggled = new EventEmitter<any>();
  @Output() concessionUpdated = new EventEmitter<any>();
  @Output() continueToPayment = new EventEmitter<void>();
  
  standardPrice = 12.99;
  premiumPrice = 16.99;
  accessiblePrice = 10.99;

  toggleSeat(seat: any): void {
    this.seatToggled.emit(seat);
  }

  updateConcessionItem(item: any, change: number): void {
    this.concessionUpdated.emit({ item, change });
  }

  getSeatPrice(seat: any): number {
    if (seat.type === 'standard') {
      return this.standardPrice;
    } else if (seat.type === 'premium') {
      return this.premiumPrice;
    } else if (seat.type === 'accessible') {
      return this.accessiblePrice;
    }
    return 0;
  }

  getConcessionQuantity(id: string): number {
    const item = this.selectedConcessions.find(c => c.id === id);
    return item ? item.quantity : 0;
  }

  onContinueToPayment(): void {
    this.continueToPayment.emit();
    this.currentStep = 3;
  }
}