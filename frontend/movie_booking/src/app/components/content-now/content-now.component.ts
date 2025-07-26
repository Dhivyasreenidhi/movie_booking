import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ContentNavbarComponent } from '../content-navbar/content-navbar.component';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-content-now',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    SidebarComponent,
    NavBarComponent,
    ContentNavbarComponent
  ],
  templateUrl: './content-now.component.html',
  styleUrl: './content-now.component.css'
})
export class ContentNowComponent {
  formData = {
    title: 'Kuberaa',
    rating: '8.5',
    votes: '1200',
    image: 'https://static.toiimg.com/thumb/msid-113147270,width-1280,height-720,resizemode-4/113147270.jpg'
  };

  constructor(private router: Router) {}

  saveChanges(form: NgForm): void {
    if (form.valid) {
      const rating = parseFloat(this.formData.rating);
      if (isNaN(rating) || rating < 0 || rating > 10) {
        alert('Rating must be a number between 0 and 10.');
        return;
      }

      const votes = parseInt(this.formData.votes.replace(/[^0-9]/g, ''), 10);
      if (isNaN(votes) || votes < 0) {
        alert('Votes must be a non-negative number.');
        return;
      }

      console.log('Saving changes:', {
        ...this.formData,
        rating,
        votes: votes.toString()
      });

      // Here you would typically call a service to save the data
      alert('Changes saved successfully!');
    }
  }

  goBack(): void {
    this.router.navigate(['/content-management']);
  }
}