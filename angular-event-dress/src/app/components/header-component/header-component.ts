import { Component, OnInit, inject } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, MenuModule, AvatarModule],
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.scss'],
})
export class HeaderComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  items: MenuItem[] | undefined;
  userMenuItems: MenuItem[] | undefined;
  guestMenuItems: MenuItem[] | undefined;
  cartItemCount: number = 0;

  isLoggedIn = this.userService.isLoggedIn;
  currentUser = this.userService.currentUser;

  ngOnInit() {
    this.items = [
      { label: 'דף הבית', routerLink: '/' },
      { label: 'הקטלוג', routerLink: '/catalog' },
      { label: 'ניהול', routerLink: '/admin' }
    ];

    this.userMenuItems = [
      { label: 'איזור אישי', icon: 'pi pi-user', routerLink: '/personal'  },
      { label: 'ההזמנות שלי', icon: 'pi pi-list', routerLink: '/orders' },
      { label: 'עגלת קניות', icon: 'pi pi-shopping-cart', routerLink: '/cart' },
      { separator: true },
      { label: 'התנתק', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];

    this.guestMenuItems = [
      { label: 'התחבר', icon: 'pi pi-sign-in', routerLink: '/login' },
      { label: 'הרשם', icon: 'pi pi-user-plus', routerLink: '/register' }
    ];
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  toggleGuestMenu(event: Event, menu: any) {
    menu.toggle(event);
  }

  onCart() {
    this.router.navigate(['/cart']);
  }

  onSearch() {
    // חיפוש
  }

  toggleUserMenu(event: Event, menu: any) {
    menu.toggle(event);
  }
}
