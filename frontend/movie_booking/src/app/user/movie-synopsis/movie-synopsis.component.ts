import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-synopsis',
  templateUrl: './movie-synopsis.component.html',
  styleUrls: ['./movie-synopsis.component.css'],
  imports: [CommonModule] // Add CommonModule
})
export class MovieSynopsisComponent {
  @Input() shortSynopsis: string = '';
  @Input() fullSynopsisPart1: string = '';
  @Input() fullSynopsisPart2: string = '';
  @Input() isLightTheme: boolean = false;
  showFullSynopsis = false;

  toggleFullSynopsis(): void {
    this.showFullSynopsis = !this.showFullSynopsis;
  }
}