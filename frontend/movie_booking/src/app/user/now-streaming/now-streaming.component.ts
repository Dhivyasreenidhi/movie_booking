import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MovieService, Movie } from '../../services/movie.service';

@Component({
  selector: 'app-now-streaming',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './now-streaming.component.html',
  styleUrls: ['./now-streaming.component.css']
})
export class NowStreamingComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies;
    });
  }
}
