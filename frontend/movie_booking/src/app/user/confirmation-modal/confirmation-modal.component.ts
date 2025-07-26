import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  imports:[CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  @Input() showModal: boolean = false;
  @Input() confirmationNumber: string = '';
  @Input() movieTitle: string = 'Jurassic World Rebirth';
  @Input() selectedDate: string = '';
  @Input() selectedTime: string = '';
  @Input() screenName: string = '';
  @Input() selectedSeats: string = '';
  @Input() concessions: any[] = [];
  @Input() totalPrice: number = 0;
  @Input() paymentMethod: string = '';
  @Output() modalClosed = new EventEmitter<void>();
  @Output() emailSent = new EventEmitter<void>();
  @Output() ticketsDownloaded = new EventEmitter<void>();

  closeModal(): void {
    this.modalClosed.emit();
  }

  sendConfirmationEmail(): void {
    // Implement email sending logic
    this.emailSent.emit();
  }

  downloadTickets(): void {
    // Implement ticket download logic
    this.ticketsDownloaded.emit();
  }
}