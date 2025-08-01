
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3001/api';
  private readonly ADMIN_CREDENTIALS = {
    email: "dhivyasreenidhidurai@gmail.com",
    phone: "9566381302"
  };
  private accessToken: string | null = null;
  private refreshTokenValue: string | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  signup(emailOrPhone: string): Observable<any> {
    // Use 'email_or_phone' for backend compatibility
    return this.http.post('/api/signup', { email_or_phone: emailOrPhone });
  }

  verifyOtp(emailOrPhone: string, otp: string): Observable<any> {
    // Use 'email_or_phone' for backend compatibility
    return this.http.post('/api/verify-otp', { email_or_phone: emailOrPhone, otp });
  }

  verifySignupOtp(emailOrPhone: string, otp: string): Observable<any> {
    // Use /api/verify-signup-otp and send { email_or_phone, otp }
    return this.http.post('/api/verify-signup-otp', { email_or_phone: emailOrPhone, otp });
  }

  login(username: string): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { emailOrPhone: username }).pipe(
      tap((response) => {
        if (response && response.token) {
          const isAdmin = username === this.ADMIN_CREDENTIALS.email || 
                          username === this.ADMIN_CREDENTIALS.phone;
          const userId = response.userId || response.id || '';
          const userData = {
            token: response.token,
            isLoggedIn: true,
            isAdmin: isAdmin,
            username: isAdmin ? 'Admin' : 'User',
            emailOrPhone: username,
            id: userId,
            user_id: userId,
            timestamp: new Date().getTime()
          };
          localStorage.setItem('kgCinemasAuth', JSON.stringify(userData));
          // Store JWT tokens if present
          if (response.access_token && response.refresh_token) {
            this.setTokens(response.access_token, response.refresh_token);
          }
        }
      }),
      map(response => !!response.token),
      catchError(err => {
        console.error("Login failed", err);
        return of(false);
      })
    );
  }


  // JWT: Get access token (in-memory)
  getAccessToken(): string | null {
    return this.accessToken;
  }

  // JWT: Get refresh token (in-memory)
  getRefreshToken(): string | null {
    return this.refreshTokenValue;
  }

  // JWT: Set tokens (in-memory)
  setTokens(access: string, refresh: string): void {
    this.accessToken = access;
    this.refreshTokenValue = refresh;
  }

  // JWT: Clear tokens (in-memory)
  clearTokens(): void {
    this.accessToken = null;
    this.refreshTokenValue = null;
  }

  // JWT: Refresh access token using refresh token
  refreshToken(): Observable<any> {
    const refresh_token = this.getRefreshToken();
    if (!refresh_token) return of(null);
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, { refresh_token }).pipe(
      tap(res => {
        if (res && res.access_token && res.refresh_token) {
          this.setTokens(res.access_token, res.refresh_token);
        }
      })
    );
  }

  // JWT: Attach token to headers for protected requests
  getAuthHeaders(): HttpHeaders {
    const token = this.getAccessToken();
    return new HttpHeaders(token ? { 'Authorization': `Bearer ${token}` } : {});
  }

  // Example: Protected API call with auto-refresh
  getProtectedResource(): Observable<any> {
    return this.http.get(`${this.apiUrl}/protected`, { headers: this.getAuthHeaders() }).pipe(
      catchError(err => {
        if (err.status === 401) {
          // Try to refresh token and retry
          return this.refreshToken().pipe(
            switchMap(() => this.http.get(`${this.apiUrl}/protected`, { headers: this.getAuthHeaders() }))
          );
        }
        return of(null);
      })
    );
  }

  logout(): void {
    this.clearTokens();
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
