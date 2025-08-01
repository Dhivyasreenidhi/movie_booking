// ...existing code...
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { NavBarComponent } from '../components/nav-bar/nav-bar.component';


interface Movie {
  id: string;
  title: string;
}

interface Showtime {
  id: number;
  movie_id: number;
  show_date: string;
  show_time: string;
  screen: string;
  total_seats: number;
  available_seats: number;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  message: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-manage-showtimes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatOptionModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    HttpClientModule,
    SidebarComponent,
    NavBarComponent
  ],
  templateUrl: './manage-showtimes.component.html',
  styleUrls: ['./manage-showtimes.component.css']
})
export class ManageShowtimesComponent implements OnInit {
  showtimes: Showtime[] = [];
  filteredShowtimes: Showtime[] = [];
  movies: Movie[] = [];
  screens: string[] = ['Screen 1', 'Screen 2', 'Screen 3', 'Screen 4'];
  selectedShowtime: Showtime = this.initializeShowtime();
  movieFilter: Movie | null = null;
  isEditMode: boolean = false;
  showFormModal: boolean = false;
  showDeleteConfirm: boolean = false;
  showSaveConfirm: boolean = false;
  showEditConfirm: boolean = false;
  showSeatBookings: boolean = false;
  selectedShowtimeForSeats: Showtime | null = null;
  seats: any[] = [];
  showtimeToDelete: string | null = null;
  lastAction: string = '';
  minDate: string = '';
  minTime: string = '';

  private moviesApiUrl = '/api/movies';
  private showtimesApiUrl = '/api/showtimes';

  constructor(private http: HttpClient) {
    const now = new Date();
    this.minDate = now.toISOString().split('T')[0];
    this.minTime = now.toTimeString().slice(0, 5);
  }

  ngOnInit(): void {
    this.fetchMovies();
    this.fetchShowtimes();
  }

  private fetchMovies(movieId?: string): void {
    this.http.get<Movie[]>(this.moviesApiUrl).subscribe({
      next: (movies) => {
        this.movies = movies;
        if (movieId) {
          this.movieFilter = movies.find(m => m.id == movieId) || null;
          this.applyFilters();
        }
        // Update showtimes with movie titles after movies are fetched
        this.showtimes = this.showtimes.map(showtime => ({
          ...showtime,
          // No movieTitle, only showtime fields
        }));
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching movies:', error);
        this.showNotification('Failed to fetch movies', 'error');
      }
    });
  }

  private fetchShowtimes(): void {
    this.http.get<Showtime[]>(this.showtimesApiUrl).subscribe({
      next: (showtimes) => {
        // Use movieTitle from backend response directly
        this.showtimes = showtimes;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error fetching showtimes:', error);
        this.showNotification('Failed to fetch showtimes', 'error');
      }
    });
  }

  private applyFilters(): void {
    this.filteredShowtimes = this.movieFilter 
      ? this.showtimes.filter(s => s.movie_id === Number(this.movieFilter!.id))
      : this.showtimes;
  }

  private initializeShowtime(): Showtime {
    return {
      id: 0,
      movie_id: this.movieFilter?.id ? Number(this.movieFilter.id) : 0,
      screen: '',
      show_date: '',
      show_time: '',
      total_seats: 0,
      available_seats: 0,
      createdAt: '',
      updatedAt: ''
    };
  }

  openAddForm(): void {
    this.isEditMode = false;
    this.selectedShowtime = this.initializeShowtime();
    this.showFormModal = true;
  }

  openEditForm(showtime: Showtime): void {
    this.isEditMode = true;
    this.selectedShowtime = { ...showtime };
    this.showFormModal = true;
  }

  openSeatBookings(showtime: Showtime): void {
    this.selectedShowtimeForSeats = { ...showtime };
    this.seats = [];
    this.showSeatBookings = true;
    // Fetch real seat data from backend
    this.http.get<any[]>(`/api/seats/${showtime.id}`).subscribe({
      next: (seats) => {
        this.seats = seats;
      },
      error: () => {
        this.seats = [];
      }
    });
  }

  closeSeatBookings(): void {
    this.showSeatBookings = false;
    this.selectedShowtimeForSeats = null;
    this.seats = [];
  }


  // No toggleSeatBooking: admin view only, seats are fetched from backend

  confirmSaveShowtime(): void {
    if (!this.isValidShowtime()) {
      alert('Please fill all required fields correctly, including the screen selection.');
      return;
    }
    if (this.isEditMode) {
      this.showEditConfirm = true;
    } else {
      this.saveShowtime();
    }
  }

  saveShowtime(): void {
    const showtimeData: Showtime = {
      ...this.selectedShowtime,
      // No movieTitle, only showtime fields
      available_seats: this.isEditMode ? this.selectedShowtime.available_seats : this.selectedShowtime.total_seats
    };

    // Prepare payload for backend
    const payload = {
      movie_id: showtimeData.movie_id,
      show_date: showtimeData.show_date,
      show_time: showtimeData.show_time,
      screen: showtimeData.screen,
      total_seats: Number(showtimeData.total_seats),
      available_seats: Number(showtimeData.available_seats)
    };
    if (this.isEditMode) {
      this.http.put<Showtime>(`${this.showtimesApiUrl}/${this.selectedShowtime.id}`, payload).subscribe({
        next: (updatedShowtime) => {
          this.fetchShowtimes();
          this.lastAction = `Showtime updated successfully!`;
          this.showFormModal = false;
          this.showEditConfirm = false;
          this.showSaveConfirm = true;
        },
        error: (error) => {
          console.error('Error updating showtime:', error);
          this.showNotification('Failed to update showtime', 'error');
        }
      });
    } else {
      this.http.post<Showtime>(this.showtimesApiUrl, payload).subscribe({
        next: (newShowtime) => {
          this.fetchShowtimes();
          this.lastAction = `Showtime added successfully!`;
          this.showFormModal = false;
          this.showSaveConfirm = true;
        },
        error: (error) => {
          console.error('Error adding showtime:', error);
          this.showNotification('Failed to add showtime', 'error');
        }
      });
    }
  }

  confirmDelete(id: string): void {
    this.showtimeToDelete = id;
    this.showDeleteConfirm = true;
  }

  deleteShowtime(): void {
    if (this.showtimeToDelete === null) return;
    
    this.http.delete(`${this.showtimesApiUrl}/${this.showtimeToDelete}`).subscribe({
      next: () => {
        const deletedShowtime = this.showtimes.find(s => s.id === Number(this.showtimeToDelete));
        const deletedMovieTitle = this.movies.find(m => Number(m.id) === deletedShowtime?.movie_id)?.title || 'Unknown';
        this.showtimes = this.showtimes.filter(s => s.id !== Number(this.showtimeToDelete));
        this.lastAction = `Showtime for "${deletedMovieTitle}" on Screen ${deletedShowtime?.screen || 'Unknown'} deleted successfully!`;
        this.showDeleteConfirm = false;
        this.showSaveConfirm = true;
        this.showtimeToDelete = null;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error deleting showtime:', error);
        this.showNotification('Failed to delete showtime', 'error');
      }
    });
  }

  closeFormModal(): void {
    this.showFormModal = false;
    this.selectedShowtime = this.initializeShowtime();
    this.isEditMode = false;
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm = false;
    this.showtimeToDelete = null;
  }

  closeSaveConfirm(): void {
    this.showSaveConfirm = false;
  }

  closeEditConfirm(): void {
    this.showEditConfirm = false;
  }

  private isValidShowtime(): boolean {
    const s = this.selectedShowtime;
    if (!s) return false;
    const selectedDateTime = new Date(`${s.show_date}T${s.show_time}`);
    const now = new Date();
    if (!s.movie_id || s.movie_id === 0) {
      this.showNotification('Please select a movie.', 'error');
      return false;
    }
    if (!s.screen || s.screen.trim() === '') {
      this.showNotification('Please select a screen.', 'error');
      return false;
    }
    if (!s.show_date) {
      this.showNotification('Please select a show date.', 'error');
      return false;
    }
    if (!s.show_time) {
      this.showNotification('Please select a show time.', 'error');
      return false;
    }
    if (selectedDateTime < now) {
      this.showNotification('Showtime must be today or later.', 'error');
      return false;
    }
    if (!s.total_seats || s.total_seats < 1) {
      this.showNotification('Total seats must be greater than 0.', 'error');
      return false;
    }
    if (s.available_seats == null || s.available_seats < 0 || s.available_seats > s.total_seats) {
      this.showNotification('Seats available must be between 0 and total seats.', 'error');
      return false;
    }
    return true;
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.lastAction = message;
    this.showSaveConfirm = true;
  }

  get totalSeatsCount(): number {
    return this.selectedShowtimeForSeats?.total_seats || 0;
  }

  get availableSeatsCount(): number {
    return this.seats ? this.seats.filter(seat => seat.status === 'available').length : 0;
  }

  get bookedSeatsCount(): number {
    return this.seats ? this.seats.filter(seat => seat.status === 'booked').length : 0;
  }
}