import { Component, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { Router } from '@angular/router';
import { MovieService, Movie as BackendMovie } from '../../services/movie.service';

interface Movie {
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

interface Notification {
  message: string;
  type: 'success' | 'error';
}

@Component({
  selector: 'app-manage-movies',
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
    NavBarComponent,ReactiveFormsModule
  ],
  templateUrl: './manage-movies.component.html',
  styleUrls: ['./manage-movies.component.css']
})
export class MovieManagementComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  selectedMovie: Movie = this.resetSelectedMovie();
  genresInput: string = '';
  castInput: string = '';
  allGenres: string[] = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller', 'Romance', 'Family', 'Adventure', 'Fantasy'];
  isEditMode = false;
  showFormModal = false;
  showDeleteConfirm = false;
  showSaveConfirm = false;
  showEditConfirm = false;
  showDetailsModal = false;
  movieToDelete: number | null = null;
  lastAction: string = '';
  searchQuery: string = '';
  selectedGenre: string = '';
  selectedRating: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.movieService.getMovies().subscribe({
      next: (movies) => {
    this.movies = movies.map(movie => ({
      ...movie,
      userRating: movie.userRating || 0
    }));
        this.applyFiltersAndPagination();
        this.updateLocalStorageForBanner();
        console.log('Movies fetched:', this.movies);
      },
      error: (error) => {
        console.error('Error fetching movies:', error);
        this.showNotification('Failed to fetch movies', 'error');
      }
    });
  }

  applyFiltersAndPagination(): void {
    let filtered = this.movies;

    if (this.searchQuery) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedGenre) {
      filtered = filtered.filter(movie =>
        (movie.genre || '').split(',').map(g => g.trim()).includes(this.selectedGenre)
      );
    }

    // If you want to filter by rating, ensure 'userRating' is used
    if (this.selectedRating) {
      filtered = filtered.filter(movie => String(movie.userRating) === this.selectedRating);
    }

    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages || 1);

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredMovies = filtered.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyFiltersAndPagination();
    }
  }

  getPaginationRange(): number[] {
    const range = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    return range;
  }

  onSearchChange(event: Event): void {
    this.searchQuery = (event.target as HTMLInputElement).value;
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onGenreChange(event: Event): void {
    this.selectedGenre = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  onRatingChange(event: Event): void {
    this.selectedRating = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.applyFiltersAndPagination();
  }

  openAddForm(): void {
    console.log('Opening Add Movie modal');
    this.selectedMovie = this.resetSelectedMovie();
    this.genresInput = '';
    this.castInput = '';
    this.isEditMode = false;
    this.showFormModal = true;
  }

  openEditForm(movie: Movie): void {
    console.log('Opening Edit Movie modal for:', movie.title);
    this.selectedMovie = {
      ...movie,
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : ''
    };
    this.genresInput = movie.genre || '';
    this.castInput = movie.cast || '';
    this.isEditMode = true;
    this.showFormModal = true;
  }

  openDetailsModal(movie: Movie): void {
    console.log('Opening Details modal for:', movie.title);
    this.selectedMovie = {
      ...movie,
      releaseDate: movie.releaseDate ? new Date(movie.releaseDate).toISOString().split('T')[0] : ''
    };
    this.showDetailsModal = true;
  }

  confirmSaveMovie(): void {
    if (!this.isValidMovie(this.selectedMovie)) {
      alert('Please fill all required fields correctly.');
      return;
    }
    if (this.isEditMode) {
      this.showEditConfirm = true;
    } else {
      this.saveMovie();
    }
  }

  saveMovie(): void {
    const movieData: Movie = {
      ...this.selectedMovie,
      genre: this.genresInput,
      cast: this.castInput,
    };

    if (this.isEditMode) {
      console.log('Updating movie:', movieData.title);
      this.movieService.updateMovie(Number(movieData.id), movieData).subscribe({
        next: () => {
          this.fetchMovies();
          this.lastAction = `Movie "${movieData.title}" updated successfully!`;
          this.showFormModal = false;
          this.showEditConfirm = false;
          this.showSaveConfirm = true;
        },
        error: (error) => {
          console.error('Error updating movie:', error);
          this.showNotification('Failed to update movie', 'error');
        }
      });
    } else {
      console.log('Adding new movie:', movieData.title);
      this.movieService.addMovie(movieData).subscribe({
        next: () => {
          this.fetchMovies();
          this.lastAction = `Movie "${movieData.title}" added successfully!`;
          this.showFormModal = false;
          this.showSaveConfirm = true;
        },
        error: (error) => {
          console.error('Error adding movie:', error);
          this.showNotification('Failed to add movie', 'error');
        }
      });
    }
  }

  confirmDelete(id: number): void {
    console.log('Confirming delete for movie ID:', id);
    this.movieToDelete = Number(id);
    this.showDeleteConfirm = true;
  }

  deleteMovie(): void {
    if (this.movieToDelete === null) {
      console.error('No movie selected for deletion');
      return;
    }
    console.log('Deleting movie ID:', this.movieToDelete);
    const movie = this.movies.find(m => m.id === this.movieToDelete);
    this.movieService.deleteMovie(this.movieToDelete).subscribe({
      next: () => {
        this.fetchMovies();
        this.lastAction = `Movie "${movie?.title || 'Unknown'}" deleted successfully!`;
        this.showDeleteConfirm = false;
        this.showSaveConfirm = true;
        this.movieToDelete = null;
      },
      error: (error) => {
        console.error('Error deleting movie:', error);
        this.showNotification('Failed to delete movie', 'error');
      }
    });
  }

  manageShowtimes(movieId: string): void {
    this.router.navigate(['/manage-show', movieId]);
  }

  closeEditConfirm(): void {
    console.log('Closing edit confirmation modal');
    this.showEditConfirm = false;
  }

  closeDetailsModal(): void {
    console.log('Closing details modal');
    this.showDetailsModal = false;
    this.resetSelectedMovie();
  }

  closeFormModal(): void {
    console.log('Closing form modal');
    this.showFormModal = false;
    this.resetSelectedMovie();
  }

  closeDeleteConfirm(): void {
    console.log('Closing delete confirmation modal');
    this.showDeleteConfirm = false;
    this.movieToDelete = null;
  }

  closeSaveConfirm(): void {
    console.log('Closing save confirmation modal');
    this.showSaveConfirm = false;
    this.resetSelectedMovie();
  }

  private isValidMovie(movie: Movie): boolean {
    const isValid = !!movie.title &&
                    !!movie.language &&
                    !!movie.posterUrl &&
                    !!this.genresInput &&
                    !!movie.duration &&
                    !!movie.releaseDate &&
                    !!movie.director &&
                    !!this.castInput;
    console.log('Movie validation result:', isValid, movie);
    return isValid;
  }

  private resetSelectedMovie(): Movie {
    return {
      title: '',
      language: '',
      posterUrl: '',
      duration: 0,
      releaseDate: '',
      director: '',
      cast: '',
      genre: '',
      description: '',
      trailerUrl: '',
      userRating: 0,
      votes: 0
    };
  }

  private showNotification(message: string, type: 'success' | 'error'): void {
    this.lastAction = message;
    this.showSaveConfirm = true;
  }

  private updateLocalStorageForBanner(): void {
    const kuberaaMovie = this.movies.find(m => m.title === 'KUBERAA');
    if (kuberaaMovie) {
      const bannerData = {
        genre: kuberaaMovie.genre || '',
        title: kuberaaMovie.title,
        director: kuberaaMovie.director,
        description: kuberaaMovie.description || '',
        status: 'NOW SHOWING', // or use another field if you have status info
        trailerUrl: kuberaaMovie.trailerUrl || '',
        posterImage: kuberaaMovie.posterUrl,
        bannerImages: [kuberaaMovie.posterUrl],
        currentBannerIndex: 0
      };
      localStorage.setItem('bannerData', JSON.stringify(bannerData));
    }
    localStorage.setItem('movies', JSON.stringify(this.movies));
  }
}