
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-moviess-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, HttpClientModule],
  templateUrl: './moviess.component.html',
  styleUrls: ['./moviess.component.css']
})
export class MoviessComponent implements OnInit {
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
    this.route.paramMap.subscribe(params => {
      const movieId = params.get('id');
      if (movieId) {
        this.fetchMovieDetails(movieId);
        this.fetchShowtimes(movieId);
      }
    });
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
    this.showSeatSelection = false;
    this.showConfirmation = true;
    // Here you would call backend to book seats
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