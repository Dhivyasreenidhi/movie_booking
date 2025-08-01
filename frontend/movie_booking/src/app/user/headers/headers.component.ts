import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ScrollserviceService } from '../../services/scrollservice.service';

@Component({
  selector: 'app-headers',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})

export class HeadersComponent implements OnInit {
  showLogoutModal = false;
  showUserDropdown = false;
  private router = inject(Router);
  private authService = inject(AuthService);
  private scrollService = inject(ScrollserviceService);

  isLoggedIn: boolean = false;
  currentUser: string = '';
  isAdmin: boolean = false;
  userId: string = '';

  ngOnInit(): void {
    this.checkAuthStatus();
    window.addEventListener('storage', () => this.checkAuthStatus());
    this.router.events?.subscribe?.(() => this.checkAuthStatus());
  }

  private checkAuthStatus(): void {
    const authData = localStorage.getItem('kgCinemasAuth');
    if (authData) {
      const parsed = JSON.parse(authData);
      this.isLoggedIn = parsed.isLoggedIn === true;
      this.isAdmin = parsed.isAdmin === true;
      this.userId = parsed.id || '';
      if (this.isAdmin) {
        this.currentUser = 'Admin';
      } else {
        if (parsed.emailOrPhone) {
          this.currentUser = parsed.emailOrPhone;
        } else {
          this.currentUser = 'User';
        }
      }
    } else {
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.currentUser = '';
      this.userId = '';
    }
  }


  // Generic scroll/navigate function for all sections
  navigateToSection(section: 'movies' | 'coming-soon' | 'offers' | 'all'): void {
    if (this.router.url === '/user-home') {
      this.scrollService.scrollToElement(section, 100);
    } else {
      this.router.navigate(['/user-home'], { fragment: section });
    }
  }

  

  confirmLogout() {
    this.showLogoutModal = true;
  }

  logout() {
    // Remove user data from localStorage and update UI state
    localStorage.removeItem('kgCinemasAuth');
    this.showLogoutModal = false;
    this.isLoggedIn = false;
    this.currentUser = '';
    this.router.navigate(['/login']);
  }
}