import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  toggleSidebar = true;
  dropdownOpen = false;
  userName: string = '';

  private SECRET_KEY = 'your-secret-key'; // 🔐 Must match login.component.ts

  @ViewChild('dropdownRef') dropdownRef!: ElementRef;

  constructor() {
    this.extractUserNameFromToken();
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (
      this.dropdownOpen &&
      this.dropdownRef &&
      !this.dropdownRef.nativeElement.contains(event.target)
    ) {
      this.dropdownOpen = false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  private extractUserNameFromToken() {
    const encryptedUser = localStorage.getItem('user');
    if (!encryptedUser) return;

    try {
      // 🔓 Decrypt the user data
      const bytes = CryptoJS.AES.decrypt(encryptedUser, this.SECRET_KEY);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      // 🧠 Parse JSON and extract user name/email
      const user = JSON.parse(decrypted);
      this.userName = user.name || user.email || '';
    } catch (error) {
      console.error('Failed to extract user from storage:', error);
      this.userName = '';
    }
  }
}
