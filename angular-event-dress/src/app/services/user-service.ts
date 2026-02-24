import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { UserRegisterModel } from '../models/user-register.model';
import { UserLoginModel } from '../models/user-login.model';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:44362/api/users';

  // אתחול ה-Signal ישירות מה-Storage (תחליף לקונסטרקטור)
  currentUser = signal<UserModel | null>(this.getUserFromStorage());
  isLoggedIn = signal<boolean>(!!this.getUserFromStorage());

  register(user: UserRegisterModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.apiUrl, user).pipe(
      tap(userData => this.setSession(userData))
    );
  }

  login(user: UserLoginModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}/login`, user).pipe(
      tap(userData => this.setSession(userData))
    );
  }

  updateUser(id: number, user: UserModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, user).pipe(
      tap(() => this.setSession(user))
    );
  }

  logout(): void {
    localStorage.removeItem('user_data');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  private setSession(userData: UserModel): void {
    localStorage.setItem('user_data', JSON.stringify(userData));
    this.currentUser.set(userData);
    this.isLoggedIn.set(true);
  }

  private getUserFromStorage(): UserModel | null {
    const savedUser = localStorage.getItem('user_data');
    if (!savedUser) return null;
    try {
      return JSON.parse(savedUser) as UserModel;
    } catch {
      return null;
    }
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/${id}`);
  }
}