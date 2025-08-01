
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SignUpEmailComponent } from '../../sign-up-email/sign-up-email.component';

@Component({
  selector: 'app-moviess-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, HttpClientModule, SignUpEmailComponent],
  templateUrl: './moviess.component.html',
  styleUrls: ['./moviess.component.css']
})
export class MoviessComponent implements OnInit {
  showLoginPopup = false;
  showSignupEmailPopup = false;
  loginUsername = '';
  loginPassword = '';
  pendingBookingData: any = null;
  public movieService: any;
  // Calendar logic
  // Add movieService property for test mocking
  today: Date = new Date();
  weekDates: Date[] = [];
  selectedDate: Date = new Date();
  movie: any = {};
  kgScreens: { name: string; showtimes: any[] }[] = [];
  showtimes: any[] = [];
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
  bookingId: string = '';
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

  constructor(
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

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

  confirmBooking(): void {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    // Check login status
    const user = localStorage.getItem('user');
    if (!user) {
      // Show login popup and store booking data
      this.pendingBookingData = {
        movie: this.movie,
        showtimeId: this.selectedShowtimeId,
        seats: this.selectedSeats,
        theater: this.selectedTheater,
        time: this.selectedTime
      };
      this.showLoginPopup = true;
      return;
    }
    // Show signup-email popup and store booking data
    this.pendingBookingData = {
      user: user,
      movie: this.movie,
      showtimeId: this.selectedShowtimeId,
      seats: this.selectedSeats,
      theater: this.selectedTheater,
      time: this.selectedTime
    };
    this.showSignupEmailPopup = true;
  }

  handleLogin(): void {
    // Simulate login (replace with real API call)
    if (this.loginUsername && this.loginPassword) {
      localStorage.setItem('user', this.loginUsername);
      this.showLoginPopup = false;
      if (this.pendingBookingData) {
        // Show signup-email popup after login
        this.pendingBookingData.user = this.loginUsername;
        this.showSignupEmailPopup = true;
        this.showLoginPopup = false;
      }
    } else {
      alert('Please enter valid credentials');
    }
  }

  // Called after successful signup in popup
  handleSignupEmailSuccess(userId: string): void {
    // Always create user, then fetch userId and proceed
    // Use the actual signup value (email or phone) from the signup popup, not localStorage
    const signupValue = userId; // userId here is the actual email or phone used for signup
    this.http.post<any>('/api/users', { email_or_phone: signupValue }).subscribe({
      next: () => {
        // After creation, fetch userId
        this.http.get<any[]>('/api/users').subscribe(users => {
          const userObj = (users || []).find((u: any) => u.email_or_phone === signupValue);
          const realUserId = userObj ? userObj.id : signupValue;
          // Set kgCinemasAuth in localStorage for header update
          localStorage.setItem('kgCinemasAuth', JSON.stringify({
            id: realUserId,
            emailOrPhone: signupValue,
            isLoggedIn: true,
            isAdmin: false
          }));
          // Navigate to paymentt with all booking details
          if (!this.pendingBookingData) return;
          const params = new URLSearchParams({
            user: signupValue,
            userId: String(realUserId),
            movie: this.pendingBookingData.movie.id,
            showtime: String(this.pendingBookingData.showtimeId),
            seats: this.pendingBookingData.seats.join(','),
            theater: this.pendingBookingData.theater,
            time: this.pendingBookingData.time
          });
          this.showSignupEmailPopup = false;
          window.location.href = `/paymentt?${params.toString()}`;
          this.pendingBookingData = null;
        });
      },
      error: (err) => {
        // Show error message to user
        this.showAlert = true;
        this.alertTitle = 'Signup Error';
        this.alertMessage = err?.error?.message || 'Failed to create user. Please check your details or try again.';
      }
    });
  }

  playTrailer(): void {
    if (this.movie && this.movie.trailerUrl) {
      this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.trailerUrl);
    } else {
      this.safeTrailerUrl = null;
    }
  }

  addToWatchlist(): void {
    alert('Added to your watchlist!');
  }

  shareMovie(): void {
    if (!this.movie) {
      alert('Movie details not available to share.');
      return;
    }
    if (navigator.share) {
      navigator.share({
        title: this.movie.title,
        text: `Check out this movie: ${this.movie.title}`,
        url: window.location.href
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      alert('Share functionality not available');
    }
  }

  addReview(): void {
    const comment = prompt('Enter your review:');
    const rating = prompt('Enter rating (1-5):');
    if (comment && rating && !isNaN(+rating) && +rating >= 1 && +rating <= 5) {
      this.reviews.unshift({
        author: 'Anonymous User',
        rating: +rating,
        comment,
        date: 'Just now'
      });
    } else {
      alert('Invalid review or rating');
    }
  }

  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
  }
}