import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { NavBarComponent } from '../nav-bar/nav-bar.component';

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,SidebarComponent,NavBarComponent],
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.css']
})
export class HelpCenterComponent {
  activeSection: string = 'movie-management';
  showDemoModal: boolean = false;
  currentDemo: string = '';
  demoStep: number = 1;

  helpSections = [
    { id: 'movie-management', title: 'Movie Management' }
  ];

  currentGuide = [
    {
      title: 'Adding a Movie',
      steps: [
        'Navigate to Movie Management from the sidebar.',
        'Click the "Add Movie" button (plus icon) at the top right.',
        'Fill in movie details (Title, Poster URL, Genre, Duration, MPAA Rating, User Rating, Votes, Release Date).',
        'Ensure all fields are valid; errors will show for invalid inputs.',
        'Click "Save Movie" to add the movie.',
        'Confirm success in the modal and click "OK" to close.'
      ],
      demo: 'add-movie'
    },
    {
      title: 'Editing a Movie',
      steps: [
        'Go to Movie Management via the sidebar.',
        'Find the movie in the grid and click the edit button (pencil icon).',
        'Update any fields as needed (e.g., Title, Genre, Rating).',
        'Ensure all fields meet validation requirements.',
        'Click "Save Movie" to update the movie.',
        'Confirm success in the modal and click "OK" to close.'
      ],
      demo: 'edit-movie'
    },
    {
      title: 'Deleting a Movie',
      steps: [
        'Access Movie Management from the sidebar.',
        'Locate the movie and click the delete button (trash can icon).',
        'Confirm deletion in the modal; this action cannot be undone.',
        'Click "Delete Permanently" to remove the movie.',
        'Confirm success in the modal and click "OK" to close.'
      ],
      demo: 'delete-movie'
    }
  ];

  getActiveSectionTitle(): string {
    return this.helpSections.find(section => section.id === this.activeSection)?.title || '';
  }

  openDemo(demo: string): void {
    this.currentDemo = demo;
    this.demoStep = 1;
    this.showDemoModal = true;
  }

  nextStep(): void {
    if (this.demoStep < 4) {
      this.demoStep++;
    } else {
      this.showDemoModal = false;
    }
  }

  prevStep(): void {
    if (this.demoStep > 1) {
      this.demoStep--;
    }
  }
}