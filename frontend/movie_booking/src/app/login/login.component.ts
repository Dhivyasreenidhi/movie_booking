import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class LoginComponent {
  loginForm: FormGroup;
  otpForm: FormGroup;
  loginError: string = '';
  otpError: string = '';
  isLoading: boolean = false;
  step: 1 | 2 = 1;
  userValue: string = '';

  showOtpPopup = false;
  demoOtp = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.pattern(/^([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|[0-9]{10})$/)
      ]],
    });
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]]
    });
  }

  onSubmit(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      this.loginError = 'Please enter a valid email or phone number';
      return;
    }
    this.isLoading = true;
    this.loginError = '';
    const emailOrPhone = this.loginForm.value.username;
    // Bypass OTP for admin credentials
    if (emailOrPhone === '9566381302' || emailOrPhone === 'dhivyasreenidhidurai@gmail.com') {
      localStorage.setItem('user', emailOrPhone);
      this.isLoading = false;
      this.router.navigate(['/admin-dashboard']);
      return;
    }
    this.http.post<any>('http://localhost:5000/api/login', { emailOrPhone }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.step = 2;
        this.userValue = emailOrPhone;
        // For demo, show OTP in popup
        this.demoOtp = res.otp;
        this.showOtpPopup = true;
      },
      error: (err) => {
        this.isLoading = false;
        this.loginError = err.error?.message || 'Login failed';
      }
    });
  }

  onOtpSubmit(): void {
    this.otpForm.markAllAsTouched();
    if (this.otpForm.invalid) {
      this.otpError = 'Please enter the 6-digit OTP';
      return;
    }
    this.isLoading = true;
    this.otpError = '';
    const otp = this.otpForm.value.otp;
    this.http.post<any>('http://localhost:5000/api/verify-otp', { emailOrPhone: this.userValue, otp }).subscribe({
      next: (res) => {
        this.isLoading = false;
        // Store user info in localStorage for header
        localStorage.setItem('kgCinemasAuth', JSON.stringify({
          isLoggedIn: true,
          isAdmin: false,
          emailOrPhone: this.userValue
        }));
        window.dispatchEvent(new Event('storage'));
        this.router.navigate(['/user-home']);
      },
      error: (err) => {
        this.isLoading = false;
        this.otpError = err.error?.message || 'OTP verification failed';
      }
    });
  }

  onInputChange() {
    this.loginError = '';
    this.otpError = '';
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToSignup() {
    this.router.navigate(['/signupemail']);
  }

  closeOtpPopup() {
    this.showOtpPopup = false;
  }
}