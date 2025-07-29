import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeadersComponent } from '../headers/headers.component';
import { FootersComponent } from '../footers/footers.component';
import { MovieService, Movie } from '../../services/movie.service';

@Component({
  selector: 'app-now-streamings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeadersComponent, FootersComponent],
  templateUrl: './now-streamings.component.html',
  styleUrls: ['./now-streamings.component.css']
})
export class NowStreamingsComponent implements OnInit {
  movies: Movie[] = [];

  constructor(private movieService: MovieService) {}

  ngOnInit(): void {
    this.movieService.getMovies().subscribe(movies => {
      this.movies = movies;
    });
  }
}