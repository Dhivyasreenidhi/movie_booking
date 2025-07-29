import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { MovieService, Movie } from '../../services/movie.service';

@Component({
  selector: 'app-coming-soon',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent],
  templateUrl: './coming-soon.component.html',
  styleUrls: ['./coming-soon.component.css']
})
export class ComingSoonComponent implements OnInit {
  showPopup = false;
  selectedMovie: any = {};
  movies: any[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        // If cast is a string, convert to array for compatibility with template
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