import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';
  private readonly ADMIN_CREDENTIALS = {
    email: "dhivyasreenidhidurai@gmail.com",
    phone: "9566381302"
  };

  constructor(private http: HttpClient, private router: Router) {}

  signup(emailOrPhone: string): Observable<any> {
    return this.http.post('http://localhost:5000/api/signup', { emailOrPhone });
  }

  verifyOtp(emailOrPhone: string, otp: string): Observable<any> {
    return this.http.post('http://localhost:5000/api/verify-otp', { emailOrPhone, otp });
  }

  // Use the correct backend endpoint and payload
  verifySignupOtp(emailOrPhone: string, otp: string): Observable<any> {
    return this.http.post('http://localhost:5000/api/verify-otp', {
      emailOrPhone,
      otp
    });
  }

  login(username: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { emailOrPhone: username }).pipe(
      tap((response) => {
        if (response && response.token) {
          const isAdmin = username === this.ADMIN_CREDENTIALS.email || 
                          username === this.ADMIN_CREDENTIALS.phone;

          const userData = {
            token: response.token,
            isLoggedIn: true,
            isAdmin: isAdmin,
            username: isAdmin ? 'Admin' : 'User',
            emailOrPhone: username,
            timestamp: new Date().getTime()
          };

          localStorage.setItem('kgCinemasAuth', JSON.stringify(userData));
        }
      }),
      map(response => !!response.token),
      catchError(err => {
        console.error("Login failed", err);
        return of(false);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('kgCinemasAuth');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.getAuthData()?.isLoggedIn === true;
  }

  isAdmin(): boolean {
    return this.getAuthData()?.isAdmin === true;
  }

  getUsername(): string {
    return this.getAuthData()?.username || 'Guest';
  }

  getToken(): string | null {
    return this.getAuthData()?.token || null;
  }

  isSessionValid(): boolean {
    const authData = this.getAuthData();
    if (!authData) return false;

    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    const now = Date.now();
    return (now - authData.timestamp) < TWENTY_FOUR_HOURS;
  }

  getUserInfo(): { emailOrPhone: string } | null {
    return this.getAuthData() ? { emailOrPhone: this.getAuthData().emailOrPhone } : null;
  }

  private getAuthData(): any {
    const data = localStorage.getItem('kgCinemasAuth');
    return data ? JSON.parse(data) : null;
  }
}
