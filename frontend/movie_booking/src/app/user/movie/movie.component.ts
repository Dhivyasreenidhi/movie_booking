import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeadersComponent } from '../headers/headers.component';
import { FootersComponent } from '../footers/footers.component';
import { TheaterBookingComponent } from '../../theater-booking/theater-booking.component';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, HeadersComponent, FootersComponent, TheaterBookingComponent],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit, OnDestroy {

  // Movie Data
  movie = {
    title: "3BHK",
    subtitle: "U • 2 hrs 20 mins • Drama, Family • Tamil, Telugu",
    rating: "U",
    duration: "2 hrs 20 mins",
    genres: "Drama, Family",
    languages: "Tamil, Telugu",
    posterUrl: "assets/movie-posters/3bhk.jpg",
    backdropUrl: "assets/movie-backdrops/3bhk-bg.jpg",
    trailerUrl: "https://www.youtube.com/embed/example",
    synopsis: "Three different families from diverse backgrounds end up living together in a 3BHK apartment, leading to conflicts, emotional drama, and ultimately, understanding.",
    starRating: 4.2,
    audienceScore: 92
  };

  // KG Cinemas screens and showtimes (populated from manage-showtimes)
  kgScreens: { name: string; type: string; showtimes: string[] }[] = [];

  // ...existing code...

  ngOnInit(): void {
    this.loadKGScreensFromShowtimes();
    // Calendar/date selection removed
  }

  loadKGScreensFromShowtimes(): void {
    // Simulate import from manage-showtimes (replace with actual service/API if available)
    // Example: Assume window['filteredShowtimes'] is available globally or via service
    const showtimes: any[] = (window as any).filteredShowtimes || [];
    const screensMap: { [key: string]: { name: string; type: string; showtimes: string[] } } = {};
    showtimes.forEach(st => {
      if (!screensMap[st.screen]) {
        screensMap[st.screen] = {
          name: st.screen,
          type: st.screenType || '',
          showtimes: []
        };
      }
      screensMap[st.screen].showtimes.push(st.showTime);
    });
    this.kgScreens = Object.values(screensMap);
  }

  // Calendar/date selection removed
  showFullSynopsis = false;
  showSeatSelection = false;
  showPayment = false;
  showConfirmation = false;
  showAlert = false;
  alertTitle: string = '';
  alertMessage: string = '';
  selectedTheater: string = '';
  selectedTime: string = '';
  ticketPrice = 250;
  isLightTheme = false;

  seats = Array.from({ length: 100 }, (_, i) => ({
    number: i + 1,
    selected: false,
    occupied: Math.random() > 0.8
  }));

  selectedSeats: number[] = [];

  paymentMethod: string = 'upi';
  upiId: string = '';
  cardNumber: string = '';
  cardExpiry: string = '';
  cardCvv: string = '';
  bank: string = '';
  isProcessing = false;
  bookingId: string = '';
  timerMinutes: number = 5;
  timerSeconds: number = 0;
  private timerInterval: any;

  offers = [
    {
      id: 1,
      title: "First Time User",
      description: "Get 10% off on your first booking",
      discount: 0,
      applied: false
    },
    {
      id: 2,
      title: "Weekend Special",
      description: "Flat ₹50 off on weekend bookings",
      discount: 0,
      applied: false
    }
  ];
  appliedOffer: any = null;
  finalTotal: number = 0;

  reviews = [
    {
      author: "Rajesh Kumar",
      rating: 4,
      comment: "Excellent family drama with great performances. The storyline keeps you engaged throughout.",
      date: "2 days ago"
    },
    {
      author: "Priya Nair",
      rating: 3,
      comment: "Good concept but slow in parts. Worth watching for the emotional moments.",
      date: "1 week ago"
    }
  ];

  cast = [
    { name: "Vijay Sethupathi", role: "Lead Actor", photoUrl: "assets/cast/vijay.jpg" },
    { name: "Nayanthara", role: "Lead Actress", photoUrl: "assets/cast/nayanthara.jpg" },
    { name: "Fahadh Faasil", role: "Supporting Actor", photoUrl: "assets/cast/fahadh.jpg" }
  ];

  safeTrailerUrl: SafeResourceUrl | null = null;
  cardSelected: boolean = false;

  constructor(private sanitizer: DomSanitizer) {}


  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  toggleTheme(): void {
    this.isLightTheme = !this.isLightTheme;
  }

  // Calendar/date selection removed

  // Removed unused theaters/updateShowtimes logic

  toggleSynopsis(): void {
    this.showFullSynopsis = !this.showFullSynopsis;
  }

  openSeatSelection(theaterName: string, time: string): void {
    this.selectedTheater = theaterName;
    this.selectedTime = time;
    this.showSeatSelection = true;
    this.selectedSeats = [];
    this.seats.forEach(seat => seat.selected = false);
  }

  toggleSeat(seat: any): void {
    if (!seat.occupied) {
      seat.selected = !seat.selected;
      this.selectedSeats = this.seats
        .filter(s => s.selected)
        .map(s => s.number);
    }
  }

  calculateTotal(): void {
    const baseTotal = this.selectedSeats.length * this.ticketPrice;
    let discount = 0;
    if (this.appliedOffer) {
      discount = this.appliedOffer.discount;
    }
    this.finalTotal = baseTotal - discount;
  }

  applyOffer(offer: any): void {
    this.offers.forEach(o => o.applied = false);
    offer.applied = true;
    this.appliedOffer = {...offer};
    if (offer.id === 1) {
      this.appliedOffer.discount = Math.floor(this.selectedSeats.length * this.ticketPrice * 0.1);
    } else if (offer.id === 2) {
      this.appliedOffer.discount = 50;
    }
    this.calculateTotal();
  }

  proceedToPayment(): void {
    if (this.selectedSeats.length === 0) {
      this.showAlertModal('No Seats Selected', 'Please select at least one seat.');
      return;
    }
    this.showSeatSelection = false;
    this.showPayment = true;
    this.calculateTotal();
    this.startTimer();
  }

  selectPaymentMethod(method: string): void {
    this.paymentMethod = method;
    this.upiId = '';
    this.cardSelected = false;
    this.cardNumber = '';
    this.cardExpiry = '';
    this.cardCvv = '';
    this.bank = '';
  }

  processPayment(): void {
    if (!this.validatePayment()) {
      this.showAlertModal('Invalid Payment Details', 'Please enter valid payment details.');
      return;
    }
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
      this.showPayment = false;
      this.showConfirmation = true;
      this.bookingId = this.generateBookingId();
      this.stopTimer();
    }, 3000);
  }

  private validatePayment(): boolean {
    if (this.paymentMethod === 'upi') {
      return this.upiId.includes('@');
    } else if (this.paymentMethod === 'card') {
      return this.cardNumber.length >= 16 && this.cardExpiry.length === 5 && this.cardCvv.length === 3;
    } else if (this.paymentMethod === 'netbanking') {
      return !!this.bank;
    }
    return false;
  }

  private generateBookingId(): string {
    return 'B' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  private startTimer(): void {
    this.timerMinutes = 5;
    this.timerSeconds = 0;
    this.timerInterval = setInterval(() => {
      if (this.timerSeconds > 0) {
        this.timerSeconds--;
      } else if (this.timerMinutes > 0) {
        this.timerMinutes--;
        this.timerSeconds = 59;
      } else {
        clearInterval(this.timerInterval);
        this.showPayment = false;
        this.showAlertModal('Session Timed Out', 'Payment session timed out.');
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  playTrailer(): void {
    this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.trailerUrl);
    this.showAlertModal('Trailer', 'Playing the trailer for ' + this.movie.title);
  }

  addToWatchlist(): void {
    this.showAlertModal('Watchlist', 'Added to your watchlist!');
  }

  shareMovie(): void {
    if (navigator.share) {
      navigator.share({
        title: this.movie.title,
        text: `Check out this movie: ${this.movie.title}`,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
        this.showAlertModal('Share Error', 'Error sharing the movie.');
      });
    } else {
      this.showAlertModal('Share Unavailable', 'Share functionality not available.');
    }
  }

  openReviewModal(): void {
    this.showAlertModal('Write a Review', 'Please enter your review and rating below.');
    const comment = prompt('Enter your review:');
    const rating = prompt('Enter rating (1-5):');
    if (comment && rating && !isNaN(+rating) && +rating >= 1 && +rating <= 5) {
      this.reviews.unshift({
        author: 'Anonymous User',
        rating: +rating,
        comment,
        date: 'Just now'
      });
      this.showAlertModal('Review Added', 'Your review has been successfully added!');
    } else {
      this.showAlertModal('Invalid Review', 'Invalid review or rating.');
    }
  }

  showAlertModal(title: string, message: string): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.showAlert = true;
  }

  closeAlert(): void {
    this.showAlert = false;
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return '★'.repeat(fullStars) +
           (halfStar ? '½' : '') +
           '☆'.repeat(emptyStars);
  }
}