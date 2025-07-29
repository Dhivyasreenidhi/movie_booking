import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadersComponent } from '../headers/headers.component';
import { FootersComponent } from '../footers/footers.component';
import { MovieService, Movie } from '../../services/movie.service';

@Component({
  selector: 'app-coming-soons',
  standalone: true,
  imports: [CommonModule, HeadersComponent, FootersComponent],
  templateUrl: './coming-soons.component.html',
  styleUrls: ['./coming-soons.component.css']
})
export class ComingSoonsComponent implements OnInit {
  showPopup = false;
  selectedMovie: any = {};
  movies: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data.map(movie => ({
          ...movie,
          cast: Array.isArray(movie.cast)
            ? movie.cast
            : (typeof movie.cast === 'string' ? movie.cast.split(',').map((c: string) => c.trim()) : [])
        }));
      },
      error: (err) => {
        console.error('Failed to fetch movies:', err);
      }
    });
  }

  openMovieDetails(movie: any) {
    this.selectedMovie = movie;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}