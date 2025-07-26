import { Component,HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule,Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-nav-bar',
  imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      RouterModule
    ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  isDropdownOpen = false;
  currentView: string = 'Admin';

  constructor(private router: Router) {}

  // Toggle dropdown visibility
  toggleDropdown(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Handle view selection
  selectView(view: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.currentView = view;
    this.isDropdownOpen = false;
    
    // Add your navigation logic here
    switch(view) {
    
      case 'Logout':
        // Handle logout logic
        break;
    }
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}
