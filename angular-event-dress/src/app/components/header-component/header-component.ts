import { Component, OnInit, inject, effect } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';

// ייבוא השירותים שלך
import { UserService } from '../../services/user-service';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule, MenuModule, AvatarModule, FormsModule, RouterModule],
  templateUrl: './header-component.html',
  styleUrls: ['./header-component.scss'],
})
export class HeaderComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public cartService = inject(CartService);

  items: MenuItem[] | undefined;
  userMenuItems: MenuItem[] | undefined;
  guestMenuItems: MenuItem[] | undefined;
  
  searchTextLocal: string = '';
  searchActive: boolean = false;
  showSearch: boolean = true;

  isLoggedIn = this.userService.isLoggedIn; 
  currentUser = this.userService.currentUser;

  constructor() {
    effect(() => {
      const user = this.userService.currentUser();
      this.updateMenuItems(user);
    });

    this.router.events.subscribe(() => {
      const url = this.router.url.split('?')[0];
      this.showSearch = url !== '/' && url !== '/home' && !url.startsWith('/admin');
    });
  }

  ngOnInit() {
    const url = this.router.url.split('?')[0];
    this.showSearch = url !== '/' && url !== '/home' && !url.startsWith('/admin');

    this.route.queryParams.subscribe(params => {
      this.searchTextLocal = params['search'] || '';
      if (this.searchTextLocal) {
        this.searchActive = true;
      }
    });
  }

  private updateMenuItems(user: any) {
    const isAdmin = user?.role === 'ADMIN';

    this.items = [
      { label: 'דף הבית', routerLink: '/' },
      { label: 'הקולקציה', routerLink: '/collection' },
      { label: 'הקטלוג', routerLink: '/catalog' },
      ...(isAdmin ? [{ label: 'ניהול', routerLink: '/admin' }] : [])
    ];

    this.userMenuItems = isAdmin ? [
      { label: 'איזור אישי', icon: 'pi pi-user', routerLink: '/personal' },
      { label: 'איזור ניהול', icon: 'pi pi-cog', routerLink: '/admin' },
      { separator: true },
      { label: 'התנתק', icon: 'pi pi-sign-out', command: () => this.logout() }
    ] : [
      { label: 'איזור אישי', icon: 'pi pi-user', routerLink: '/personal' },
      { label: 'ההזמנות שלי', icon: 'pi pi-list',  routerLink: `/orders/${user?.id}` },
      { label: 'עגלת קניות', icon: 'pi pi-shopping-cart', command: () => this.onCart() },
      { separator: true },
      { label: 'התנתק', icon: 'pi pi-sign-out', command: () => this.logout() }
    ];

    this.guestMenuItems = [
      { label: 'התחבר', icon: 'pi pi-sign-in', routerLink: '/login' },
      { label: 'הרשם', icon: 'pi pi-user-plus', routerLink: '/register' }
    ];
  }

  toggleGuestMenu(event: Event, menu: any) {
    menu.toggle(event);
  }

  toggleUserMenu(event: Event, menu: any) {
    menu.toggle(event);
  }

  onCart() {
    this.router.navigate(['/checkout']);
  }

  openSearch() {
    this.searchActive = true;
  }

  closeSearch() {
    this.searchActive = false;
    this.searchTextLocal = '';
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: null },
      queryParamsHandling: 'merge'
    });
  }

  onSearchTextChange() {
    if (!this.searchTextLocal || this.searchTextLocal.trim() === '') {
      this.performSearch();
    }
  }

  performSearch() {
    const text = this.searchTextLocal.trim();
    this.router.navigate(['/collection'], {
      queryParams: { 
        search: text || null, 
        page: 1 
      },
      queryParamsHandling: 'merge'
    });
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}