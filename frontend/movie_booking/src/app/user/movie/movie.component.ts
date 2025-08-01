import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HeadersComponent } from '../headers/headers.component';
import { FootersComponent } from '../footers/footers.component';
import { TheaterBookingComponent } from '../../theater-booking/theater-booking.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, FormsModule, HeadersComponent, FootersComponent, TheaterBookingComponent, HttpClientModule],
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit, OnDestroy {

  // Movie Data
  movie: any = {};

  // Calendar logic
  today: Date = new Date();
  weekDates: Date[] = [];
  selectedDate: Date = new Date();
  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  // KG Cinemas screens and showtimes (populated from manage-showtimes)
  kgScreens: { name: string; showtimes: any[] }[] = [];
  showtimes: any[] = [];

  ngOnInit(): void {
    // Generate week dates (today + next 6 days)
    this.weekDates = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(this.today.getDate() + i);
      return d;
    });
    this.selectedDate = this.today;

    this.route.paramMap.subscribe(params => {
      const movieId = params.get('id');
      if (movieId) {
        this.fetchMovieDetails(movieId);
        this.fetchShowtimes(movieId);
      }
    });
  }

  onSelectDate(date: Date): void {
    this.selectedDate = date;
  }


  fetchMovieDetails(movieId: string): void {
    this.http.get<any>(`/api/movies/${movieId}`).subscribe({
      next: (data) => {
        // Fill missing fields with empty string
        this.movie = {
          id: data.id || '',
          title: data.title || '',
          description: data.description || '',
          genre: data.genre || '',
          releaseDate: data.releaseDate || '',
          duration: data.duration || '',
          director: data.director || '',
          cast: data.cast || '',
          language: data.language || '',
          posterUrl: data.posterUrl || '',
          trailerUrl: data.trailerUrl || '',
          userRating: data.userRating || '',
          votes: data.votes || '',
          createdAt: data.createdAt || '',
          updatedAt: data.updatedAt || ''
        };
      },
      error: () => {
        this.movie = {
          id: '', title: '', description: '', genre: '', releaseDate: '', duration: '', director: '', cast: '', language: '', posterUrl: '', trailerUrl: '', userRating: '', votes: '', createdAt: '', updatedAt: ''
        };
      }
    });
  }
  fetchShowtimes(movieId: string): void {
    this.http.get<any[]>(`/api/showtimes/movie/${movieId}`).subscribe({
      next: (showtimes) => {
        this.showtimes = showtimes;
        // Group by screen, each showtime is the full object
        const screensMap: { [key: string]: { name: string; showtimes: any[] } } = {};
        showtimes.forEach(st => {
          if (!screensMap[st.screen]) {
            screensMap[st.screen] = {
              name: st.screen,
              showtimes: []
            };
          }
          screensMap[st.screen].showtimes.push(st);
        });
        this.kgScreens = Object.values(screensMap);
      },
      error: () => {
        this.kgScreens = [];
        this.showtimes = [];
      }
    });
  }

  // Calendar/date selection removed
  showFullSynopsis = false;
  showSeatSelection = false;
  showConfirmation = false;
  showAlert = false;
  alertTitle: string = '';
  alertMessage: string = '';
  selectedTheater: string = '';
  selectedTime: string = '';
  ticketPrice = 250;
  isLightTheme = false;


  seats: any[] = [];
  selectedShowtimeId: number | null = null;

  selectedSeats: number[] = [];

  // Payment logic removed
  bookingId: string = '';

  // Offers/payment logic removed

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
  // Payment logic removed

  // (removed duplicate constructor)


  ngOnDestroy(): void {
    // No payment timer to clear
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
    // Find the showtime object for this screen and time
    let showtimeObj = null;
    for (const screen of this.kgScreens) {
      if (screen.name === theaterName) {
        showtimeObj = screen.showtimes.find(st => st.show_time === time);
        break;
      }
    }
    if (showtimeObj) {
      this.selectedShowtimeId = showtimeObj.id;
      this.fetchSeatsForShowtime(showtimeObj.id);
    } else {
      this.selectedShowtimeId = null;
      this.seats = [];
    }
    this.showSeatSelection = true;
    this.selectedSeats = [];
  }

  fetchSeatsForShowtime(showtimeId: number): void {
    this.http.get<any[]>(`/api/seats/${showtimeId}`).subscribe({
      next: (seats) => {
        // Each seat: { id, showtime_id, seat_number, status }
        this.seats = seats.map(seat => ({
          ...seat,
          selected: false,
          occupied: seat.status === 'booked',
          number: seat.seat_number
        }));
      },
      error: () => {
        this.seats = [];
      }
    });
  }

  toggleSeat(seat: any): void {
    if (!seat.occupied) {
      seat.selected = !seat.selected;
      this.selectedSeats = this.seats
        .filter(s => s.selected)
        .map(s => s.number);
    }
  }

  calculateTotal(): number {
    return this.selectedSeats.length * this.ticketPrice;
  }

  // Offers/payment logic removed

  confirmBooking(): void {
    if (this.selectedSeats.length === 0) {
      this.showAlertModal('No Seats Selected', 'Please select at least one seat.');
      return;
    }
    if (!this.selectedShowtimeId) {
      this.showAlertModal('Error', 'No showtime selected.');
      return;
    }
    // Book seats in backend
    this.http.post('/api/seats/book', {
      showtimeId: this.selectedShowtimeId,
      seatNumbers: this.selectedSeats
    }).subscribe({
      next: () => {
        this.showSeatSelection = false;
        this.showConfirmation = true;
        this.bookingId = this.generateBookingId();
        // Refresh seats for this showtime
        this.fetchSeatsForShowtime(this.selectedShowtimeId!);
        // Do NOT fetch or use latest user/userId
        this.navigateToPaymentProcess();
      },
      error: () => {
        this.showAlertModal('Booking Failed', 'Could not book seats. Please try again.');
      }
    });
  }

  // Payment logic removed

  // Payment logic removed

  private generateBookingId(): string {
    return 'B' + Math.random().toString(36).substr(2, 9).toUpperCase();
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


  closeAlert(): void {
    this.showAlert = false;
  }

  showAlertModal(title: string, message: string): void {
    this.alertTitle = title;
    this.alertMessage = message;
    this.showAlert = true;
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return '★'.repeat(fullStars) +
           (halfStar ? '½' : '') +
           '☆'.repeat(emptyStars);
  }

  // Helper function for navigation to payment-process
  navigateToPaymentProcess(): void {
    this.router.navigate(['/payment-process'], {
      queryParams: {
        movie: this.movie.id,
        showtime: this.selectedShowtimeId,
        seats: this.selectedSeats.join(','),
        theater: this.selectedTheater,
        time: this.selectedTime,
        ticketPrice: this.ticketPrice,
        total: this.selectedSeats.length * this.ticketPrice
      }
    });
  }
}