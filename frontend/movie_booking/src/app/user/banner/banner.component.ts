import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-banner',
  imports: [CommonModule],
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit, OnDestroy {
  movies: any[] = [];
  currentIndex: number = 0;
  interval: any = null;
  showPopup: boolean = false;
  selectedMovie: any = null;

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    // Fetch movies from backend (dynamic)
    this.contentService.getBanner().subscribe((data: any[]) => {
      this.movies = (data || []).map(banner => ({
        ...banner,
        posterUrl: banner.posterImage || banner.posterUrl
        // details is already included from backend!
      }));
      this.loadFromLocalStorage();
      this.startAutoSlide();
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  startAutoSlide(): void {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide(): void {
    if (this.movies.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.movies.length;
    }
  }

  prevSlide(): void {
    if (this.movies.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.movies.length) % this.movies.length;
    }
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
    this.resetAutoSlide();
  }

  resetAutoSlide(): void {
    clearInterval(this.interval);
    this.startAutoSlide();
  }

  openPopup(): void {
    this.selectedMovie = this.movies[this.currentIndex];
    this.showPopup = true;
    document.body.style.overflow = 'hidden';
  }

  closePopup(): void {
    this.showPopup = false;
    document.body.style.overflow = '';
  }

  toggleFavorite(): void {
    if (this.selectedMovie) {
      this.selectedMovie.isFavorited = !this.selectedMovie.isFavorited;
      this.saveToLocalStorage();
    }
  }

  toggleWatched(): void {
    if (this.selectedMovie) {
      this.selectedMovie.isWatched = !this.selectedMovie.isWatched;
      this.saveToLocalStorage();
    }
  }

  saveToLocalStorage(): void {
    localStorage.setItem('movies', JSON.stringify(this.movies));
  }

  loadFromLocalStorage(): void {
    const storedMovies = localStorage.getItem('movies');
    if (storedMovies) {
      const parsedMovies = JSON.parse(storedMovies);
      this.movies = this.movies.map((movie, index) => ({
        ...movie,
        isFavorited: parsedMovies[index]?.isFavorited || false,
        isWatched: parsedMovies[index]?.isWatched || false
      }));
    }
  }
  
  bookTicket(): void {
    // Implement book ticket logic, e.g. route to booking page or show modal
    alert('Book Ticket for: ' + this.movies[this.currentIndex]?.title);
  }
  
  moreInfo(): void {
    // Implement more info logic, e.g. open modal or route
    this.openPopup();
  }
}