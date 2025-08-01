import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Showtime {
  id: number;
  movie_id: number;
  show_date: string;
  show_time: string;
  screen: string;
  total_seats: number;
  available_seats: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class ShowtimeService {
  private apiUrl = '/api/showtimes';

  constructor(private http: HttpClient) {}

  getShowtimes(): Observable<Showtime[]> {
    return this.http.get<Showtime[]>(this.apiUrl);
  }
}
