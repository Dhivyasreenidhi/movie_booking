import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, Inject } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HeadersComponent } from '../headers/headers.component';
import { FootersComponent } from '../footers/footers.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [CommonModule, NgClass, NgIf, HeadersComponent, FootersComponent, MatDialogModule, MatButtonModule],
  templateUrl: './booking-management.component.html',
})
export class BookingManagementComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  userId: string = '';
  userEmail: string = '';
  activeBookings: any[] = [];
  bookingHistory: any[] = [];
  showtimeDates: { [key: string]: string } = {};
  loading = true;
  error = '';
  showToast = false;
  toastMessage = '';

  constructor(private http: HttpClient, private dialog: MatDialog) {}

  ngOnInit() {
    // Get userId and email from localStorage
    const authData = localStorage.getItem('kgCinemasAuth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        this.userId = parsed.id || parsed.user_id || '';
        this.userEmail = parsed.email || '';
        console.log('BookingManagementComponent: userId from localStorage:', this.userId);
        console.log('BookingManagementComponent: userEmail from localStorage:', this.userEmail);
      } catch {}
    }
    this.fetchBookings();
  }

  fetchBookings() {
    this.loading = true;
    this.error = '';
    this.http.get<any[]>(`/api/payments?user_id=${this.userId}`).subscribe({
      next: (payments: any[]) => {
        console.log('BookingManagementComponent: fetched payments:', payments);
        this.activeBookings = payments.filter((p: any) => p.status !== 'watched');
        this.bookingHistory = payments.filter((p: any) => p.status === 'watched');
        const showtimeIds = payments.map(p => p.showtime_id).filter(id => !!id);
        if (showtimeIds.length > 0) {
          this.http.get<any[]>(`/api/showtimes`).subscribe({
            next: (showtimes: any[]) => {
              showtimes.forEach(st => {
                this.showtimeDates[st.id] = st.show_date;
              });
            }
          });
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load bookings.';
        this.loading = false;
      }
    });
  }

  downloadTicket(booking: any) {
    const doc = new jsPDF();
    const logoUrl = 'http://kgcinemas.com/wp-content/uploads/2024/07/kg-cinema-logo.png';
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = logoUrl;
    img.onload = () => {
      // Header
      doc.setFillColor(76, 0, 0); // dark red
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F');
      doc.addImage(img, 'PNG', 10, 5, 30, 30);
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text('KG CINEMAS', 45, 20);
      doc.setFontSize(14);
      doc.text('Movie Ticket', 45, 32);

      // Ticket Data (no table)
      let y = 55;
      doc.setFontSize(13);
      doc.setTextColor(255, 0, 0); // red
      doc.text('Movie:', 20, y);
      doc.setTextColor(0, 0, 0); // black
      doc.text(booking.movie_title || booking.movie, 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Theater:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(booking.theater, 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Showtime:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(booking.showtime, 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Show Date:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(this.showtimeDates[booking.showtime_id] || 'N/A', 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Booking ID:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(String(booking.id || booking.paymentId), 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Seats:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(String(booking.seats), 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Total Paid:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(`₹${booking.amount}`, 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Status:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(booking.status ? booking.status.toUpperCase() : 'N/A', 60, y);

      // Footer
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFillColor(0, 0, 0); // black
      doc.rect(0, pageHeight - 25, doc.internal.pageSize.getWidth(), 25, 'F');
      doc.setFontSize(11);
      doc.setTextColor(255, 0, 0);
      doc.text('Thank you for booking with KG Cinemas!', 20, pageHeight - 10);
      doc.setTextColor(255, 255, 255);
      doc.text('For support, contact: support@kgcinemas.com', 20, pageHeight - 4);

      doc.save(`ticket_${booking.id || booking.paymentId}.pdf`);
    };
    img.onerror = () => {
      // fallback if image fails to load
      doc.setFillColor(76, 0, 0);
      doc.rect(0, 0, doc.internal.pageSize.getWidth(), 40, 'F');
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text('KG CINEMAS', 45, 20);
      doc.setFontSize(14);
      doc.text('Movie Ticket', 45, 32);

      let y = 55;
      doc.setFontSize(13);
      doc.setTextColor(255, 0, 0);
      doc.text('Movie:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(booking.movie_title || booking.movie, 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Theater:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(booking.theater, 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Showtime:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(booking.showtime, 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Show Date:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(this.showtimeDates[booking.showtime_id] || 'N/A', 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Booking ID:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(String(booking.id || booking.paymentId), 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Seats:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(String(booking.seats), 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Total Paid:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(`₹${booking.amount}`, 60, y);
      y += 10;
      doc.setTextColor(255, 0, 0);
      doc.text('Status:', 20, y);
      doc.setTextColor(0, 0, 0);
      doc.text(booking.status ? booking.status.toUpperCase() : 'N/A', 60, y);

      const pageHeight = doc.internal.pageSize.getHeight();
      doc.setFillColor(0, 0, 0);
      doc.rect(0, pageHeight - 25, doc.internal.pageSize.getWidth(), 25, 'F');
      doc.setFontSize(11);
      doc.setTextColor(255, 0, 0);
      doc.text('Thank you for booking with KG Cinemas!', 20, pageHeight - 10);
      doc.setTextColor(255, 255, 255);
      doc.text('For support, contact: support@kgcinemas.com', 20, pageHeight - 4);

      doc.save(`ticket_${booking.id || booking.paymentId}.pdf`);
    };
  }

  sendTicketEmail(booking: any) {
    const ticketDetails = {
      movie: booking.movie_title || booking.movie,
      theater: booking.theater,
      showtime: booking.showtime,
      showDate: this.showtimeDates[booking.showtime_id] || 'N/A',
      bookingId: booking.id || booking.paymentId,
      seats: booking.seats,
      amount: booking.amount,
      status: booking.status,
      email: this.userEmail,
    };

    this.http.post('/api/send-ticket-email', ticketDetails).subscribe({
      next: () => {
        alert(`Ticket details sent to ${this.userEmail}`);
      },
      error: () => {
        alert('Failed to send ticket email. Please try again.');
      }
    });
  }

  cancelTicket(booking: any) {
    const dialogRef = this.dialog.open(CancellationConfirmationDialogComponent, {
      width: '500px',
      data: { bookingId: booking.id || booking.paymentId }
    });

    dialogRef.afterClosed().subscribe((agreed: boolean) => {
      if (agreed) {
        // Simulate successful cancel: update status locally and move to history
        booking.status = 'canceled';
        this.activeBookings = this.activeBookings.filter(b => b !== booking);
        this.bookingHistory.push(booking);
        this.toastMessage = 'Booking cancelled successfully. Refund will be processed within 1 business day.';
        this.showToast = true;
        setTimeout(() => { this.showToast = false; }, 5000);
      } else {
        this.toastMessage = 'You must agree to the cancellation terms and refund policy to cancel your booking.';
        this.showToast = true;
        setTimeout(() => { this.showToast = false; }, 5000);
      }
    });
  }

  closeManagement() {
    this.close.emit();
  }
}

@Component({
  selector: 'app-cancellation-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div class="p-6 bg-[#4C0000]/95 backdrop-blur-md border-b border-red-800/30 shadow-inner">
      <h2 class="text-2xl font-bold ">Cancel Booking</h2>
      <div class="text-white">
        <p class="mb-4">Are you sure you want to cancel booking ID: {{data.bookingId}}?</p>
        <div class="bg-gray-800/80 p-4 rounded-lg">
          <h3 class="text-lg font-semibold text-red-600 mb-2">Cancellation Terms and Conditions</h3>
          <p class="text-sm">
            1. Refunds will be processed within 7-10 business days to the original payment method.<br>
            2. A cancellation fee of ₹50 or 10% of the ticket price (whichever is higher) will be deducted.<br>
            3. Cancellations are allowed only up to 2 hours before the showtime.<br>
            4. No refunds will be issued for cancellations made after the allowed period.<br>
            5. Refunds are subject to verification and may be rejected if the booking is found to be fraudulent.<br>
            6. In case of show cancellation by the theater, a full refund will be issued automatically.<br>
            7. Refunds for online convenience fees are non-refundable.<br>
            8. The management reserves the right to modify these terms at any time without prior notice.
          </p>
          <h3 class="text-lg font-semibold text-red-600 mt-4 mb-2">Refund Policy</h3>
          <p class="text-sm">
            Our refund policy ensures fair processing of cancellations. Refunds will be credited to the original payment method after deducting applicable fees. Please ensure your payment details are accurate. For any disputes, contact our support team within 30 days of the transaction. We strive to process refunds promptly but delays may occur due to banking procedures.
          </p>
        </div>
        <div class="mt-4">
          <label class="flex items-center text-gray-300">
              <input type="checkbox" [checked]="agreed" (change)="onAgreementChange($event)" class="mr-2">
            I agree to the cancellation terms and refund policy
          </label>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <button mat-button (click)="onCancel()" class="bg-gray-600 text-white px-4 py-2 rounded">Close</button>
        <button mat-button (click)="onConfirm()" [disabled]="!agreed" class="bg-red-600 text-white px-4 py-2 rounded ml-2">Confirm Cancellation</button>
      </div>
    </div>
  `,
})
export class CancellationConfirmationDialogComponent {
  agreed: boolean = false;
  constructor(public dialogRef: MatDialogRef<CancellationConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { bookingId: string }) {}

  onCancel() {
    this.dialogRef.close(false);
  }

  onConfirm() {
    this.dialogRef.close(true);
  }

    onAgreementChange(event: Event) {
      const input = event.target as HTMLInputElement;
      this.agreed = input.checked;
    }
}