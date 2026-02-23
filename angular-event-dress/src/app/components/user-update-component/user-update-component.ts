import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { UserModel } from '../../models/user.model';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-user-update-component',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, PasswordModule, CardModule],
  templateUrl: './user-update-component.html',
  styleUrl: './user-update-component.scss',
})
export class UserUpdateComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  user: UserModel = new UserModel();
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  loading = signal(false);

  ngOnInit(): void {
    const currentUser = this.userService.currentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.user = { ...currentUser };
  }

  onSubmit(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    
    this.userService.updateUser(this.user.id, this.user).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('הפרטים עודכנו בהצלחה');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error || 'העדכון נכשל');
      }
    });
  }
}
