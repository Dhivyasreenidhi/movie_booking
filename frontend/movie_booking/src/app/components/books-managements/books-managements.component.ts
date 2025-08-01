import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-books-managements',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NavBarComponent],
  templateUrl: './books-managements.component.html',
  styleUrls: ['./books-managements.component.css']
})
export class BooksManagementsComponent implements OnInit {
  // Show delete confirmation toast for the selected payment
  confirmDelete(payment: any) {
    this.toastPayment = payment;
    this.toastType = 'delete';
    this.showToast = true;
  }

  // Perform the actual delete after confirmation
  deleteBooking() {
    if (!this.toastPayment) return;
    this.loading = true;
    this.http.delete(`/api/payments/${this.toastPayment.id || this.toastPayment.paymentId}`).subscribe({
      next: () => {
        this.payments = this.payments.filter((p: any) => p !== this.toastPayment);
        this.filteredPayments = this.filteredPayments.filter((p: any) => p !== this.toastPayment);
        this.updatePagination();
        this.closeToast();
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to delete booking. Please try again.';
        this.loading = false;
      }
    });
  }
  today: Date = new Date();
  showToast: boolean = false;
  toastPayment: any = null;
  payments: any[] = [];
  filteredPayments: any[] = [];
  paginatedPayments: any[] = [];
  loading: boolean = false;
  error: string = '';
  searchQuery: string = '';
  filterStatus: string = '';
  sortBy: string = 'id';
  currentPage: number = 1;
  pageSize: number = 10;

  get totalPages(): number {
    return Math.ceil(this.filteredPayments.length / this.pageSize) || 1;
  }

    toastType: 'details' | 'refund' | 'delete' = 'details';
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPayments();
  }

  fetchPayments() {
    this.loading = true;
    this.error = '';
    this.http.get<any[]>('/api/payments').subscribe({
      next: (data: any[]) => {
        // For demo: assign random statuses to show all status types in the table
        const statusOptions = ['pending', 'watched', 'wants_refund', 'refunded', 'watched']; // treat 'enclosed' as 'watched'
        this.payments = (data || []).map((payment, idx) => {
          let status = payment.status && payment.status.trim() ? payment.status : statusOptions[idx % statusOptions.length];
          if (status === 'enclosed') status = 'watched';
          return { ...payment, status };
        });
        this.filteredPayments = [...this.payments];
        this.applyFilters();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to fetch bookings. Please try again.';
        this.loading = false;
      }
    });
  }

  searchBookings() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPayments = this.payments.filter(payment =>
      payment.id?.toString().includes(query) ||
      payment.movie_title?.toLowerCase().includes(query) ||
      payment.theater?.toLowerCase().includes(query)
    );
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.payments];
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(payment =>
        payment.id?.toString().includes(query) ||
        payment.movie_title?.toLowerCase().includes(query) ||
        payment.theater?.toLowerCase().includes(query)
      );
    }

    if (this.filterStatus) {
      filtered = filtered.filter(payment => payment.status === this.filterStatus);
    }

    this.filteredPayments = filtered;
    this.sortBookings();
  }

  sortBookings() {
    this.filteredPayments.sort((a, b) => {
      switch (this.sortBy) {
        case 'movie':
          return a.movie_title.localeCompare(b.movie_title);
        case 'amount':
          return a.amount - b.amount;
        case 'showtime':
          return new Date(a.showtime).getTime() - new Date(b.showtime).getTime();
        default:
          return a.id - b.id;
      }
    });
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPayments = this.filteredPayments.slice(start, end);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  // Removed markWatched: status changes should be handled via backend or other admin actions

  acceptRefund(payment: any) {
    payment.status = 'refunded';
    this.toastPayment = payment;
    this.toastType = 'refund';
    this.showToast = true;
    // TODO: Optionally call backend to persist refund status
  }

  viewDetails(payment: any) {
    this.toastPayment = payment;
    this.toastType = 'details';
    this.showToast = true;
  }

  closeToast() {
    this.showToast = false;
    this.toastPayment = null;
  }

  exportToCSV() {
    const headers = [
      'ID',
      'Movie Title',
      'Showtime',
      'Theater',
      'Seats',
      'Amount',
      'Discount',
      'Offer Used',
      'Status'
    ];

    const csvData = this.filteredPayments.map(payment => [
      payment.id || payment.paymentId,
      payment.movie_title || payment.movie,
      new Date(payment.showtime).toLocaleString(),
      payment.theater,
      payment.seats,
      payment.amount,
      payment.discount,
      payment.offer_used || payment.offerUsed || 'None',
      payment.status
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }

    sendReminder(payment: any): void {
      // TODO: Implement resend confirmation logic (API call or UI feedback)
      // Optionally show a toast for resend confirmation
    }
}