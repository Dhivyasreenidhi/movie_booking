import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router'; // Import Router
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-moviess-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './moviess.component.html',
  styleUrls: ['./moviess.component.css']
})
export class MoviessComponent implements OnInit, OnDestroy {
  // Movie Data
  movie = {
    title: "# 3BHK",
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

  // Showtimes Data
  theaters = [
    {
      name: "KGCinemas - Forum Mall",
      location: "Racecourse, Coimabatore",
      showtimes: ["10:30 AM", "1:45 PM", "4:30 PM", "8:15 PM"]
    },
    {
      name: "KGCinemas - Garuda Mall",
      location: "Cheran Nagar, Coimbatore",
      showtimes: ["11:00 AM", "2:30 PM", "6:45 PM", "9:30 PM"]
    }
  ];

  // Dynamic Date Generation
  dates: any[] = [];
  selectedDate: any;
  showFullSynopsis = false;
  showSeatSelection = false;
  showPayment = false;
  showConfirmation = false;
  selectedTheater: string = '';
  selectedTime: string = '';
  ticketPrice = 250; // Price per ticket in INR

  // Seat Selection Data (100 seats)
  seats = Array.from({ length: 100 }, (_, i) => ({
    number: i + 1,
    selected: false,
    occupied: Math.random() > 0.8 // 20% chance of being occupied
  }));

  selectedSeats: number[] = [];

  // Payment Data
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

  // Reviews Data
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

  // Cast Data
  cast = [
    { name: "Vijay Sethupathi", role: "Lead Actor", photoUrl: "assets/cast/vijay.jpg" },
    { name: "Nayanthara", role: "Lead Actress", photoUrl: "assets/cast/nayanthara.jpg" },
    { name: "Fahadh Faasil", role: "Supporting Actor", photoUrl: "assets/cast/fahadh.jpg" }
  ];

  safeTrailerUrl: SafeResourceUrl | null = null;
  cardSelected: boolean = false;

  constructor(private sanitizer: DomSanitizer, private router: Router) {} // Inject Router

  ngOnInit(): void {
    this.generateDates();
    this.selectedDate = this.dates[0];
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  // Generate next 5 days for showtime selection
  private generateDates(): void {
    const today = new Date();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      this.dates.push({
        day: days[date.getDay()],
        date: date.getDate(),
        month: months[date.getMonth()],
        active: i === 0
      });
    }
  }

  // Select a date for showtimes
  selectDate(date: any): void {
    this.dates.forEach(d => d.active = false);
    date.active = true;
    this.selectedDate = date;
    this.updateShowtimes();
  }

  // Simulate dynamic showtimes update
  private updateShowtimes(): void {
    this.theaters = this.theaters.map(theater => ({
      ...theater,
      showtimes: theater.showtimes.map(time => {
        const [hours, minutes] = time.split(':');
        const period = time.split(' ')[1];
        return `${hours}:${minutes} ${period}`;
      })
    }));
  }

  // Toggle synopsis view
  toggleSynopsis(): void {
    this.showFullSynopsis = !this.showFullSynopsis;
  }

  // Open seat selection modal
  openSeatSelection(theaterName: string, time: string): void {
    this.selectedTheater = theaterName;
    this.selectedTime = time;
    this.showSeatSelection = true;
    this.selectedSeats = [];
    this.seats.forEach(seat => seat.selected = false);
  }

  // Toggle seat selection
  toggleSeat(seat: any): void {
    if (!seat.occupied) {
      seat.selected = !seat.selected;
      this.selectedSeats = this.seats
        .filter(s => s.selected)
        .map(s => s.number);
    }
  }

  // Proceed to payment (Modified to navigate to login)
  proceedToPayment(): void {
    if (this.selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    this.showSeatSelection = false;
    // Navigate to login page instead of showing payment modal
    this.router.navigate(['/login']);
  }

  // Select payment method
  

  // Play trailer
  playTrailer(): void {
    this.safeTrailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.movie.trailerUrl);
  }

  // Add to watchlist
  addToWatchlist(): void {
    console.log('Added to watchlist');
    alert('Added to your watchlist!');
  }

  // Share movie
  shareMovie(): void {
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

  // Add a review
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

  // Get star rating display
  getStarRating(rating: number): string {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    return '★'.repeat(fullStars) + 
           (halfStar ? '½' : '') + 
           '☆'.repeat(emptyStars);
  }
}