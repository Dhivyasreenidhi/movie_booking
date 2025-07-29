import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-paymentt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paymentt.component.html',
  styleUrls: ['./paymentt.component.css']
})
export class PaymenttComponent {
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

  getSubtotal(): number {
    return Number(this.selectedSeats.length) * Number(this.ticketPrice);
  }

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      const seats = params['seats'];
      this.selectedSeats = seats ? seats.split(',') : [];
      this.ticketPrice = Number(params['total']) / (this.selectedSeats.length || 1);
      this.total = Number(params['total']) || 0;
      this.movieId = params['movieId'] || '';
      this.showtimeId = params['showtimeId'] || '';
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
    const paymentData = {
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
        this.paymentSuccess = true;
        this.paymentDetails = {
          ...paymentData,
          paymentId: res.paymentId
        };
        this.showPaymentGateway = false;
      },
      error: (err) => {
        alert('Failed to store payment details. Please try again.');
      }
    });
  }

  // Tab switching functionality
  switchTab(tabId: string) {
    this.selectedTab = tabId;
  }
}