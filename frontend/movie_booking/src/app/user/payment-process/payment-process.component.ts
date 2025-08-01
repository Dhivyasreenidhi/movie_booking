import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { HeadersComponent } from '../headers/headers.component';
import { FootersComponent } from '../footers/footers.component';

@Component({
  selector: 'app-payment-process',
  imports: [CommonModule,FormsModule,HeadersComponent,FootersComponent],
  templateUrl: './payment-process.component.html',
  styleUrls: ['./payment-process.component.css']
})
export class PaymentProcessComponent  {

  public paymentIcons: string[] = [];
  public paymentService: any;
  showPaymentToast: boolean = false;
  // Add paymentService property for test mocking
  showPaymentGateway: boolean = false;
  selectedTab: string = 'card';
  selectedSeats: string[] = [];
  ticketPrice: number = 0;
  total: number = 0;
  movieId: string = '';
  showtimeId: string = '';
  movieTitle: string = '';
  showtime: string = '';
  theater: string = '';
  activeOffer: string = '';
  discount: number = 0;
  offers: any[] = [];
  isPaying: boolean = false;
  paymentError: string = '';
  userEmailOrPhone: string = '';
  userId: string = '';

  getSubtotal(): number {
    return Number(this.selectedSeats.length) * Number(this.ticketPrice);
  }

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    // Always use user info from localStorage only
    this.userEmailOrPhone = localStorage.getItem('user') || '';
    this.userId = localStorage.getItem('userId') || '';

    // Booking info from queryParams or localStorage
    this.route.queryParams.subscribe((params: any) => {
      this.selectedSeats = params['seats'] ? params['seats'].split(',') : (localStorage.getItem('seats') ? localStorage.getItem('seats')!.split(',') : []);
      this.movieId = params['movie'] || localStorage.getItem('movie') || '';
      this.showtimeId = params['showtime'] || localStorage.getItem('showtime') || '';
      this.theater = params['theater'] || localStorage.getItem('theater') || '';
      this.showtime = params['time'] || localStorage.getItem('time') || '';
      this.ticketPrice = params['ticketPrice'] ? Number(params['ticketPrice']) : (localStorage.getItem('ticketPrice') ? Number(localStorage.getItem('ticketPrice')) : 250);
      this.total = params['total'] ? Number(params['total']) : (localStorage.getItem('total') ? Number(localStorage.getItem('total')) : (this.selectedSeats.length * this.ticketPrice));

      // If any key missing, fallback to localStorage.bookingInfo
      const data = localStorage.getItem('bookingInfo');
      if (data) {
        const info = JSON.parse(data);
        if ((!this.selectedSeats || this.selectedSeats.length === 0) && info.seats) this.selectedSeats = info.seats;
        if (!this.movieId && info.movie) this.movieId = info.movie;
        if (!this.showtimeId && info.showtime) this.showtimeId = info.showtime;
        if (!this.theater && info.theater) this.theater = info.theater;
        if (!this.showtime && info.time) this.showtime = info.time;
        if (!this.ticketPrice && info.ticketPrice) this.ticketPrice = info.ticketPrice;
        if (!this.total && info.total) this.total = info.total;
      }

      if (this.movieId) this.fetchMovieDetails(this.movieId);
      if (this.showtimeId) this.fetchShowtimeDetails(this.showtimeId);
    });
  }

  ngOnInit() {
  this.fetchOffers();
  }

  fetchOffers() {
    this.http.get<any[]>('/api/offers').subscribe(
      data => {
        this.offers = data || [];
      },
      error => {
        this.offers = [];
      }
    );
  }

  fetchMovieDetails(movieId: string) {
    this.http.get<any>(`/api/movies/${movieId}`).subscribe(data => {
      this.movieTitle = data.title || '';
    });
  }

  fetchShowtimeDetails(showtimeId: string) {
    this.http.get<any>(`/api/showtimes/${showtimeId}`).subscribe(data => {
      this.showtime = data.show_time || '';
      this.theater = data.screen || '';
    });
  }

  applyOffer(offerCode: string) {
    if (this.activeOffer === offerCode) {
      this.activeOffer = '';
      this.discount = 0;
      return;
    }
    this.activeOffer = offerCode;
    // Calculate discount based on selected offer from offers array
    const subtotal = Number(this.selectedSeats.length) * Number(this.ticketPrice);
    const offer = this.offers.find(o => o.code === offerCode);
    if (offer) {
      if (offer.discountType === 'percentage') {
        const percent = Number(offer.discountValue) / 100;
        const maxDiscount = offer.maxDiscount ? Number(offer.maxDiscount) : subtotal;
        this.discount = Math.round(Math.min(subtotal * percent, maxDiscount));
      } else if (offer.discountType === 'flat') {
        this.discount = Math.round(Number(offer.discountValue));
      } else {
        this.discount = 0;
      }
    } else {
      // fallback for hardcoded offers
      switch(offerCode) {
        case 'WELCOME20':
          this.discount = Math.round(Math.min(subtotal * 0.2, 100)); // 20% off, max ₹100
          break;
        case 'MOVIE25':
          this.discount = 25; // Flat ₹25 off
          break;
        default:
          this.discount = 0;
      }
    }
  }

  calculateFinalAmount(): number {
    const subtotal = Number(this.selectedSeats.length) * Number(this.ticketPrice);
    const total = subtotal - this.discount;
    return total > 0 ? total : 0;
  }

  paymentSuccess: boolean = false;
  paymentDetails: any = null;

  confirmPayment() {
    // Only allow payment if payment gateway is visible (i.e., after Confirm & Pay)
    if (!this.showPaymentGateway) {
      this.showPaymentGateway = true;
      return;
    }
    this.isPaying = true;
    this.paymentError = '';
    // Use userId fetched from backend
    const paymentData = {
      user_id: this.userId,
      movie: this.movieTitle,
      showtime: this.showtime,
      theater: this.theater,
      seats: this.selectedSeats,
      amount: this.calculateFinalAmount(),
      discount: this.discount,
      offerUsed: this.activeOffer || 'None'
    };
    this.http.post('/api/payments', paymentData).subscribe({
      next: (res: any) => {
        console.log('Payment API response:', res);
        this.paymentSuccess = true;
        this.showPaymentToast = true;
        setTimeout(() => {
          this.showPaymentToast = false;
        }, 3000);
        console.log('Payment Success Popup Triggered:', this.paymentSuccess);
        this.paymentDetails = {
          ...paymentData,
          paymentId: res.paymentId
        };
        // Set kgCinemasAuth in localStorage for header update
        localStorage.setItem('kgCinemasAuth', JSON.stringify({
          id: this.userId,
          emailOrPhone: this.userEmailOrPhone,
          isLoggedIn: true,
          isAdmin: false
        }));
        this.showPaymentGateway = false;
        this.isPaying = false;
        this.paymentError = '';
      },
      error: (err) => {
        this.isPaying = false;
        this.paymentError = 'Failed to store payment details. Please try again.';
      }
    });
  }

  // Tab switching functionality
  switchTab(tabId: string) {
    this.selectedTab = tabId;
  }
}
  