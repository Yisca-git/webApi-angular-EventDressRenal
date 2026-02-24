
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { UserLoginModel } from '../../models/user-login.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-user-login-component',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, CardModule],
  templateUrl: './user-login-component.html',
  styleUrl: './user-login-component.scss',
})
export class UserLoginComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  user: UserLoginModel = new UserLoginModel();
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  loading = signal(false);

  onSubmit(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    
    this.userService.login(this.user).subscribe({
      next: () => {
        this.loading.set(false);
        const currentUser = this.userService.currentUser();
        if (currentUser?.role === 'ADMIN') {
          this.successMessage.set('התחברת בהצלחה כמנהל!');
          setTimeout(() => this.router.navigate(['/admin']), 1500);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        console.error('Login error:', err);
        this.errorMessage.set(err?.error?.message || err?.message || 'שגיאת חיבור לשרת');
      }
    });
  }
}
