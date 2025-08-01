import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  getRecentBookings(): Observable<any[]> {
    // Return mock data for testing
    return of([
      { user: 'User1', movie: 'Movie1', seats: 'A1,A2', time: '10:00', status: 'Confirmed' },
      { user: 'User2', movie: 'Movie2', seats: 'B1,B2', time: '12:00', status: 'Pending' }
    ]);
  }
}
