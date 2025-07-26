import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for currency pipe

@Component({
  selector: 'app-order-summary',
  standalone: true, // Make it standalone
  imports: [CommonModule], // Import CommonModule
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.css'] // Change to .css (adjust if you use .scss)
})
export class OrderSummaryComponent {
  @Input() movieTitle: string = '';
  @Input() selectedDateLabel: string = '';
  @Input() selectedTime: string = '';
  @Input() selectedScreen: number = 1;
  @Input() selectedSeats: any[] = [];
  @Input() selectedConcessions: any[] = [];
  @Input() subtotal: number = 0;
  @Input() promoApplied: boolean = false;
  @Input() promoCode: string = '';
  @Input() promoDiscount: number = 0;
  @Input() loyaltyPointsUsed: number = 0;
  @Input() totalPrice: number = 0;
  @Output() continueToPayment = new EventEmitter<void>();

  get showContinueButton(): boolean {
    return this.selectedSeats.length > 0;
  }

  getScreenName(id: number): string {
    const screens = [
      { id: 1, name: 'Screen 1 - Dolby Cinema' },
      { id: 2, name: 'Screen 2 - IMAX' },
      { id: 3, name: 'Screen 3 - Standard' }
    ];
    const screen = screens.find(s => s.id === id);
    return screen ? screen.name : 'Unknown Screen';
  }

  onContinueToPayment(): void {
    this.continueToPayment.emit();
  }
}