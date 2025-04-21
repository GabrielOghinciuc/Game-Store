import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserDataBaseInterface } from '../interfaces/user-interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://localhost:7262/Users';
  private baseUrl = 'https://localhost:7262';
  private currentUserSubject =
    new BehaviorSubject<UserDataBaseInterface | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeUserState();
  }

  private initializeUserState(): void {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this.currentUserSubject.next(JSON.parse(savedUser));
      }
    }
  }

  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    return `${this.baseUrl}${imagePath}`;
  }

  login(email: string, password: string): Observable<UserDataBaseInterface> {
    return this.http
      .post<UserDataBaseInterface>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((user) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  deleteAccount(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`).pipe(
      tap(() => {
        this.logout();
      })
    );
  }
}
