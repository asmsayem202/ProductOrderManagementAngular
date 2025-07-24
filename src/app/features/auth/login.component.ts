import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { Toast } from '../../core/utils/toast';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  showPassword = false;
  private SECRET_KEY = 'your-secret-key'; // 🔒 Change this in prod

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  onSubmit() {
    if (this.loginForm.invalid) return;

    const email = this.loginForm.value.email ?? '';
    const password = this.loginForm.value.password ?? '';

    this.authService.login({ email, password }).subscribe({
      next: (res: any) => {
        const token = res.token;

        // ✅ Step 1: Decode JWT Payload
        const payload = this.decodeJwt(token);

        // ✅ Step 2: Extract user info from payload
        const user = {
          name:
            payload[
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
            ] || '',
          email:
            payload[
              'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
            ] || '',
        };

        console.log('user data--', user);

        // ✅ Step 3: Encrypt and store
        localStorage.setItem('token', this.encrypt(token));
        localStorage.setItem('user', this.encrypt(user));

        Toast.fire({
          icon: 'success',
          title: 'Login successful',
        });

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        Toast.fire({
          icon: 'error',
          title: 'Login failed',
          text: err?.error?.message || 'Invalid credentials',
        });
      },
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // 🔓 Decode base64 JWT payload
  private decodeJwt(token: string): any {
    try {
      const base64Payload = token.split('.')[1];
      const jsonPayload = atob(base64Payload);
      return JSON.parse(jsonPayload);
    } catch {
      return {};
    }
  }

  // 🔐 Encrypt data using AES
  private encrypt(data: any): string {
    return CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.SECRET_KEY
    ).toString();
  }
}
