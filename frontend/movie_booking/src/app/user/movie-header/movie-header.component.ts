import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-header',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './movie-header.component.html',
  styleUrls: ['./movie-header.component.css']
})
export class MovieHeaderComponent {
  @Input() movie: any;
  @Output() playTrailer = new EventEmitter<void>();
  @Output() addToWatchlist = new EventEmitter<void>();
  @Output() shareMovie = new EventEmitter<void>();

  onPlayTrailer(): void {
    this.playTrailer.emit();
  }

  onAddToWatchlist(): void {
    this.addToWatchlist.emit();
  }

  onShareMovie(): void {
    this.shareMovie.emit();
  }
}