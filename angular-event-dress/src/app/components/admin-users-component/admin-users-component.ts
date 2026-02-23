import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { UserModel } from '../../models/user.model';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, TableModule, ButtonModule, InputTextModule],
  templateUrl: './admin-users-component.html',
  styleUrl: './admin-users-component.scss',
})
export class AdminUsersComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  users = signal<UserModel[]>([]);
  loading = signal(true);
  searchId: number | null = null;
  searchResult = signal<UserModel | null>(null);
  searchError = signal<string>('');

  ngOnInit(): void {
    if (!this.userService.currentUser()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.loading.set(true);
    this.searchResult.set(null);
    this.searchError.set('');
    
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  searchUserById(): void {
    if (!this.searchId) {
      this.searchError.set('אנא הכנס מזהה משתמש');
      return;
    }

    this.searchError.set('');
    this.loading.set(true);

    this.userService.getUserById(this.searchId).subscribe({
      next: (user) => {
        this.searchResult.set(user);
        this.users.set([user]);
        this.loading.set(false);
      },
      error: () => {
        this.searchError.set('משתמש לא נמצא');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
