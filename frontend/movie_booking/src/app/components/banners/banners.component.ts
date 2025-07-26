import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContentService } from '../../services/content.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-banners',
  imports: [CommonModule, FormsModule],
  templateUrl: './banners.component.html',
  styleUrl: './banners.component.css'
})
export class BannersComponent implements OnInit, OnDestroy {
  movies: any[] = [];
  currentIndex = 0;
  interval: any;
  showPopup = false;
  selectedMovie: any;

  constructor(private contentService: ContentService) {}

  ngOnInit(): void {
    this.contentService.getBanner().subscribe((data: any[]) => {
      this.movies = (data || []).map(banner => ({
        ...banner,
        posterUrl: banner.posterImage || banner.posterUrl
        // details is already included from backend!
      }));
      this.startAutoSlide();
    });
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

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  openPopup(): void {
    this.selectedMovie = { ...this.movies[this.currentIndex] };
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  moreInfo(): void {
    // Implement more info logic, e.g. open modal or route
    alert('More Info: ' + this.movies[this.currentIndex]?.title);
  }

  bookTicket(): void {
    // Implement book ticket logic, e.g. route to booking page
    alert('Book Ticket for: ' + this.movies[this.currentIndex]?.title);
  }
}










