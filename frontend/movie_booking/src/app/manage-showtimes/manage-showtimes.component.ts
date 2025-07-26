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
import { ActivatedRoute } from '@angular/router';

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
  bookedSeats: boolean[] = [];
  showtimeToDelete: string | null = null;
  lastAction: string = '';
  minDate: string = '';
  minTime: string = '';

  private moviesApiUrl = 'http://localhost:5000/api/movies';
  private showtimesApiUrl = 'http://localhost:5000/api/showtimes';

  constructor(private http: HttpClient, private route: ActivatedRoute) {
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
    this.bookedSeats = Array(showtime.total_seats).fill(false);
    const bookedCount = showtime.total_seats - showtime.available_seats;
    for (let i = 0; i < bookedCount; i++) {
      this.bookedSeats[i] = true;
    }
    this.showSeatBookings = true;
  }

  closeSeatBookings(): void {
    this.showSeatBookings = false;
    this.selectedShowtimeForSeats = null;
    this.bookedSeats = [];
  }

  toggleSeatBooking(index: number): void {
    if (!this.selectedShowtimeForSeats) return;

    this.bookedSeats[index] = !this.bookedSeats[index];
    const bookedCount = this.bookedSeats.filter(seat => seat).length;
    this.selectedShowtimeForSeats.available_seats = this.selectedShowtimeForSeats.total_seats - bookedCount;

    // Update the showtime in the backend
    const showtimeData: Showtime = {
      ...this.selectedShowtimeForSeats,
      // No movieTitle, only showtime fields
    };

    this.http.put<Showtime>(`${this.showtimesApiUrl}/${this.selectedShowtimeForSeats.id}`, showtimeData).subscribe({
      next: (updatedShowtime) => {
        this.showtimes = this.showtimes.map(s => s.id === updatedShowtime.id ? updatedShowtime : s);
        this.applyFilters();
        this.lastAction = `Seat booking updated for showtime ID ${updatedShowtime.id} on Screen ${updatedShowtime.screen}`;
        this.showSaveConfirm = true;
      },
      error: (error) => {
        console.error('Error updating seat booking:', error);
        this.showNotification('Failed to update seat booking', 'error');
        // Revert changes if API call fails
        this.bookedSeats[index] = !this.bookedSeats[index];
        this.selectedShowtimeForSeats!.available_seats = this.selectedShowtimeForSeats!.total_seats - this.bookedSeats.filter(seat => seat).length;
      }
    });
  }

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
    const selectedDateTime = new Date(`${this.selectedShowtime.show_date}T${this.selectedShowtime.show_time}`);
    const now = new Date();
    return !!this.selectedShowtime.movie_id &&
           !!this.selectedShowtime.screen &&
           !!this.selectedShowtime.show_date &&
           !!this.selectedShowtime.show_time &&
           selectedDateTime >= now &&
           this.selectedShowtime.total_seats > 0 &&
           this.selectedShowtime.available_seats >= 0 &&
           this.selectedShowtime.available_seats <= this.selectedShowtime.total_seats;
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.lastAction = message;
    this.showSaveConfirm = true;
  }
}