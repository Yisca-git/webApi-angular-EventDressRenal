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
  loading = signal(false);

  onSubmit(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    
    this.userService.login(this.user).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error || 'Login failed');
      }
    });
  }

  loginAsAdmin(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    
    this.userService.login(this.user).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error || 'Login failed');
      }
    });
  }
}
