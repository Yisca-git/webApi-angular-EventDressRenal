import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { OrderService } from '../../services/order-service';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-personal-orders-component',
  standalone: true, // חשוב מאוד
  imports: [CommonModule, TableModule, TagModule, ButtonModule], 
  templateUrl: './personal-orders-component.html',
  styleUrl: './personal-orders-component.scss',
})
export class PersonalOrdersComponent  { 
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private userService = inject(UserService);

  orders = signal<any[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    const user = this.userService.currentUser();
    if (user?.role === 'ADMIN') {
      this.router.navigate(['/admin']);
      return;
    }
    
    const userIdRaw = this.route.snapshot.paramMap.get('id');
    if (userIdRaw) {
      const userId = Number(userIdRaw);

      this.orderService.getOrdersByUserId(userId).subscribe({
        next: (data) => {
          this.orders.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('שגיאה בטעינת הזמנות', err);
          this.loading.set(false);
        }
      });
    } else {
      this.loading.set(false);
    }
  }

getSeverity(status: string): "success" | "secondary" | "info" | "warn" | "danger" | "contrast" | undefined {
  switch (status) {
    case 'delivered': return 'success';
    case 'pending': return 'warn';   
    case 'cancelled': return 'danger';
    default: return 'info';
  }
}
}