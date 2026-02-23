import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  templateUrl: './user-profile-component.html',
  styleUrl: './user-profile-component.scss',
})
export class UserProfileComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  currentUser = this.userService.currentUser;

  ngOnInit(): void {
    if (!this.currentUser()) {
      this.router.navigate(['/login']);
    }
  }

  navigateToUpdate(): void {
    this.router.navigate(['/update-profile']);
  }
}
