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
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, TableModule, ButtonModule, InputTextModule, DialogModule, SelectModule],
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
  
  editDialog = signal(false);
  editingUser: UserModel | null = null;
  roleOptions = [{label: 'משתמש', value: 'USER'}, {label: 'מנהל', value: 'ADMIN'}];

  ngOnInit(): void {
    const user = this.userService.currentUser();
    if (!user || user.role !== 'ADMIN') {
      this.router.navigate(['/']);
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

  openEditDialog(user: UserModel): void {
    const currentUser = this.userService.currentUser();
    if (currentUser && user.id === currentUser.id) {
      alert('לא ניתן לערוך את המשתמש המחובר באיזור זה. אנא השתמש באיזור האישי.');
      return;
    }
    this.editingUser = { ...user };
    this.editDialog.set(true);
  }

  saveUser(): void {
    if (!this.editingUser) return;
    
    this.userService.updateUser(this.editingUser.id, this.editingUser).subscribe({
      next: () => {
        this.editDialog.set(false);
        this.loadAllUsers();
      },
      error: (err) => {
        console.error('שגיאה בעדכון משתמש:', err);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}