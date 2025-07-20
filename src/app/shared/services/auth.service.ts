import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient, private router: Router) {}

  // Login user
  login(payload: { email: string; password: string }) {
    return this.http
      .post<{ token: string }>(`${this.baseUrl}/login`, payload)
      .pipe(
        tap((res) => {
          localStorage.setItem('token', res.token);
        })
      );
  }

  // Register user
  register(payload: { email: string; password: string }) {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  // Assign role to a user (admin only)
  assignRole(payload: { email: string; role: string }) {
    return this.http.post(`${this.baseUrl}/assign-role`, payload);
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Check if token exists in localStorage
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // Get token (for interceptor use)
  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
