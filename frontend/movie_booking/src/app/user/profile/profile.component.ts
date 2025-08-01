import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeadersComponent } from '../headers/headers.component';
import { FootersComponent } from '../footers/footers.component';

interface User {
  name: string;
  email: string;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, HeadersComponent, FootersComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  showLogoutModal = false;

  userEmailOrPhone: string = '';

  constructor(private router: Router) {
    // Get user email or phone from localStorage
    const authData = localStorage.getItem('kgCinemasAuth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        this.userEmailOrPhone = parsed.emailOrPhone || '';
      } catch {}
    }
  }

  navigateToBookingManagement() {
    this.router.navigate(['/booking-management']);
  }

  showTermsToast = false;
  termsMessage = '';

  viewTerms() {
    this.termsMessage = `
      <strong>Booking Guidelines:</strong><br>
      1. Select your movie, showtime, and seats.<br>
      2. Complete payment to confirm your booking.<br>
      3. You will receive a confirmation via email or SMS.<br><br>
      <strong>Cancellation Policy:</strong><br>
      - If you cancel your ticket before the show day, you will receive a full refund.<br>
      - Cancellations on the show day or after are non-refundable.<br>
      - Please contact support for any issues.<br>
    `;
    this.showTermsToast = true;
    setTimeout(() => {
      this.showTermsToast = false;
    }, 10000);
  }

  confirmLogout() {
    this.showLogoutModal = true;
  }

  logout() {
    this.showLogoutModal = false;
    // In a real app, clear authentication tokens, etc.
    this.router.navigate(['/login']);
  }
}