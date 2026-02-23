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

  currentUser = signal<UserModel | null>(null);
  isLoggedIn = signal(false);

  register(user: UserRegisterModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.apiUrl, user).pipe(
      tap(userData => {
        this.currentUser.set(userData);
        this.isLoggedIn.set(true);
      })
    );
  }

  login(user: UserLoginModel): Observable<UserModel> {
    return this.http.post<UserModel>(`${this.apiUrl}/login`, user).pipe(
      tap(userData => {
        this.currentUser.set(userData);
        this.isLoggedIn.set(true);
      })
    );
  }

  updateUser(id: number, user: UserModel): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, user).pipe(
      tap(() => {
        this.currentUser.set(user);
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.apiUrl}/${id}`);
  }
}
