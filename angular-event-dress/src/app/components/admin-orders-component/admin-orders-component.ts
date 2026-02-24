import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { OrderService } from '../../services/order-service';
import { UserService } from '../../services/user-service';
import { OrderModel } from '../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, CardModule],
  templateUrl: './admin-orders-component.html',
  styleUrl: './admin-orders-component.scss'
})
export class AdminOrdersComponent implements OnInit {
  private orderService = inject(OrderService);
  private userService = inject(UserService);
  private router = inject(Router);

  orders: OrderModel[] = [];
  loading: boolean = true;

  ngOnInit(): void {
    const user = this.userService.currentUser();
    if (!user || user.role !== 'ADMIN') {
      this.router.navigate(['/']);
      return;
    }
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (err) => {
        console.error('שגיאה בטעינת הזמנות:', err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
