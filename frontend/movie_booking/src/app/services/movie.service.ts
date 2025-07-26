import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Movie {
  id?: number;
  title: string;
  description?: string;
  genre?: string;
  releaseDate?: string;
  duration?: number;
  director?: string;
  cast?: string;
  language?: string;
  posterUrl?: string;
  trailerUrl?: string;
  userRating?: number;
  votes?: number;
}

@Injectable({ providedIn: 'root' })
export class MovieService {
  private apiUrl = 'http://localhost:5000/api/movies';

  constructor(private http: HttpClient) {}

  getMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.apiUrl);
  }

  addMovie(movie: Movie): Observable<any> {
    // Ensure correct types for backend
    const payload = {
      ...movie,
      duration: movie.duration ? Number(movie.duration) : 0,
      userRating: movie.userRating ? Number(movie.userRating) : 0,
      votes: movie.votes ? Number(movie.votes) : 0,
      releaseDate: movie.releaseDate ? movie.releaseDate : null
    };
    return this.http.post(this.apiUrl, payload);
  }

  updateMovie(id: number, movie: Movie): Observable<any> {
    // Ensure correct types for backend
    const payload = {
      ...movie,
      duration: movie.duration ? Number(movie.duration) : 0,
      userRating: movie.userRating ? Number(movie.userRating) : 0,
      votes: movie.votes ? Number(movie.votes) : 0,
      releaseDate: movie.releaseDate ? movie.releaseDate : null
    };
    return this.http.put(`${this.apiUrl}/${id}`, payload);
  }

  deleteMovie(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
