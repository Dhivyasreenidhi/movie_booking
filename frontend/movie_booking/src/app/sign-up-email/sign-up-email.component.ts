// src/app/components/sign-up-email/sign-up-email.component.ts
import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service'; // ✅ import service
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-sign-up-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './sign-up-email.component.html',
  styleUrls: ['./sign-up-email.component.css']
})
export class SignUpEmailComponent {
  @Input() bookingData: any;
  @Output() signupSuccess = new EventEmitter<string>();
  isLoading = false;
  signupForm: FormGroup;
  otpForm: FormGroup;
  emailOrPhoneValue = '';
  generatedOTP = '';
  maskedEmailOrPhone = '';
  isPhoneInput = false;
  currentStep = 1;
  otpError = '';
  otpDigits: string[] = Array(6).fill('');
  showOtpPopup = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService // ✅ inject AuthService
  ) {
    this.signupForm = this.fb.group({
      email_or_phone: ['', [Validators.required, this.emailOrPhoneValidator()]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  emailOrPhoneValidator() {
    return (control: FormControl) => {
      const value = control.value;
      if (!value) return null;
      if (/^\d+$/.test(value)) {
        return value.length === 10 ? null : { invalidPhone: true };
      }
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : { invalidEmail: true };
    };
  }

  sendOtp(): void {
    if (this.signupForm.valid) {
      this.emailOrPhoneValue = this.signupForm.get('email_or_phone')?.value;
      this.authService.signup(this.emailOrPhoneValue).subscribe({
        next: (res) => {
          // Store JWT token if present
          if (res.token) {
            this.authService.setTokens(res.token, ''); // No refresh token for signup, just store access
          }
          this.generatedOTP = res.otp || '';
          this.maskedEmailOrPhone = this.isPhoneInput
            ? `+91${this.emailOrPhoneValue.substring(0, 3)}****${this.emailOrPhoneValue.substring(7)}`
            : `${this.emailOrPhoneValue.substring(0, 3)}****@${this.emailOrPhoneValue.split('@')[1]}`;
          this.currentStep = 2;
          this.showOtpPopup = true;
        },
        error: (err) => {
          console.error('Signup failed:', err);
        }
      });
    }
  }

  verifyOtp(): void {
    if (this.isLoading) return; // Prevent double submit
    this.isLoading = true;
    const enteredOTP = this.otpForm.get('otp')?.value;
    if (!enteredOTP || enteredOTP.length !== 6) {
      this.otpError = 'Please enter a 6-digit OTP';
      this.isLoading = false;
      return;
    }
    this.authService.verifySignupOtp(this.emailOrPhoneValue, enteredOTP).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.otpError = '';
          // Store tokens in AuthService (in-memory, not localStorage)
          if (res.access_token && res.refresh_token) {
            this.authService.setTokens(res.access_token, res.refresh_token);
          }
          // Store user info in localStorage for header display
          const userData = {
            token: res.access_token,
            isLoggedIn: true,
            isAdmin: false,
            username: this.emailOrPhoneValue,
            emailOrPhone: this.emailOrPhoneValue,
            id: res.userId || '',
            user_id: res.userId || '',
            timestamp: new Date().getTime()
          };
          localStorage.setItem('kgCinemasAuth', JSON.stringify(userData));
          // Navigate to user home page after successful signup
          this.router.navigate(['/user-home']);
        } else if (res.message === 'This email or phone is already registered.') {
          this.otpError = 'This email or phone is already registered.';
        } else {
          this.otpError = 'Invalid OTP. Please try again.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.otpError = 'Invalid OTP. Please try again.';
      }
    });
  }

  checkInputType(): void {
    const value = this.signupForm.get('emailOrPhone')?.value;
    this.isPhoneInput = /^\d+$/.test(value);
  }

  resendOtp(): void {
    this.generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Resent OTP: ${this.generatedOTP}`);
    this.otpError = '';
    this.otpDigits = Array(6).fill('');
  }

  moveToNext(event: any, index: number): void {
    const value = event.target.value;
    if (value.length === 1 && index < 5) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }
  }

  onKeyDown(event: any, index: number): void {
    if (event.key === 'Backspace' && !event.target.value && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text') ?? '';
    if (/^\d{6}$/.test(pasteData)) {
      this.otpDigits = pasteData.split('').slice(0, 6);
    }
  }

  goBack(): void {
    this.router.navigate(['/login']);
  }

  goToLogin() {
  this.router.navigate(['/login']);
}
}
