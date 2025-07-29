// now-streaming.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ShowtimeService, Showtime } from '../../services/showtime.service';
import { MovieService, Movie } from '../../services/movie.service';

@Component({
  selector: 'app-now-streaming',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './now-streaming.component.html',
  styleUrls: ['./now-streaming.component.css']
})
export class NowStreamingComponent implements OnInit {
  showtimesWithMovie: any[] = [];
  scrollAmount = 0;
  scrollStep = 300;
  private touchStartX = 0;

  constructor(private showtimeService: ShowtimeService, private movieService: MovieService) { }

  ngOnInit(): void {
    this.showtimeService.getShowtimes().subscribe({
      next: (showtimes) => {
        this.movieService.getMovies().subscribe({
          next: (allMovies) => {
            this.showtimesWithMovie = showtimes.map(showtime => {
              const movie = allMovies.find(m => m.id === showtime.movie_id);
              return { showtime, movie };
            });
          },
          error: (err) => {
            console.error('Failed to fetch movies:', err);
            this.showtimesWithMovie = [];
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch showtimes:', err);
        this.showtimesWithMovie = [];
      }
    });
  }

  scrollPrev(carousel: HTMLElement): void {
    this.scrollAmount -= this.scrollStep;
    if (this.scrollAmount < 0) this.scrollAmount = 0;
    carousel.scrollTo({
      left: this.scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollNext(carousel: HTMLElement): void {
    this.scrollAmount += this.scrollStep;
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    if (this.scrollAmount > maxScroll) this.scrollAmount = maxScroll;
    carousel.scrollTo({
      left: this.scrollAmount,
      behavior: 'smooth'
    });
  }

  handleTouchStart(event: TouchEvent): void {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  handleTouchEnd(event: TouchEvent, carousel: HTMLElement): void {
    const touchEndX = event.changedTouches[0].screenX;
    if (touchEndX < this.touchStartX - 50) {
      this.scrollNext(carousel); // Swipe left
    }
    if (touchEndX > this.touchStartX + 50) {
      this.scrollPrev(carousel); // Swipe right
    }
  }
}