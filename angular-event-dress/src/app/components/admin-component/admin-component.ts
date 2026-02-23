import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, CardModule, ButtonModule],
  templateUrl: './admin-component.html',
  styleUrl: './admin-component.scss',
})
export class AdminComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  currentUser = this.userService.currentUser;

  ngOnInit(): void {
    if (!this.currentUser()) {
      this.router.navigate(['/login']);
    }
  }
}
