import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, tap } from 'rxjs';
import { UserDataBaseInterface } from '../interfaces/user-interface';
import { isPlatformBrowser } from '@angular/common';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://localhost:7262';
  public currentUserSubject = new BehaviorSubject<UserDataBaseInterface | null>(
    null
  );
  public currentUser$ = this.currentUserSubject.asObservable();
  private cachedGames = new Map<string, any>();

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

  public getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${this.baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  }

  public login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/Users/login`, { email, password })
      .pipe(
        tap((response) => {
          const userData = response.user || response;
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(userData));
          }
          this.currentUserSubject.next(userData);
        })
      );
  }

  public logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      this.cachedGames.clear();
    }
    this.currentUserSubject.next(null);
  }

  public deleteAccount(userId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/Users/${userId}`).pipe(
      tap(() => {
        this.logout();
      })
    );
  }

  public updateProfile(
    userId: string,
    userData: Partial<UserDataBaseInterface> | FormData
  ): Observable<UserDataBaseInterface> {
    return this.http
      .put<UserDataBaseInterface>(
        `${this.baseUrl}/Users/edit-profile/${userId}`,
        userData
      )
      .pipe(
        tap((updatedUser) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
          this.currentUserSubject.next(updatedUser);
        })
      );
  }

  public refreshUserData(updatedUser: UserDataBaseInterface) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    this.currentUserSubject.next(updatedUser);
  }

  public uploadProfileImage(userId: string, file: File) {
    const formData = new FormData();
    const currentUser = this.currentUserSubject.getValue();

    if (file.size > 0) {
      formData.append('ProfilePicture', file);
    }

    return this.http
      .put<UserDataBaseInterface>(
        `${this.baseUrl}/Users/edit-profile/${userId}`,
        formData
      )
      .pipe(
        tap((updatedUser) => {
          this.refreshUserData(updatedUser);
        })
      );
  }

  public fetchBoughtGames(gameIds: number[]): Observable<{ games: any[] }> {
    const cacheKey = gameIds.sort().join(',');
    if (this.cachedGames.has(cacheKey)) {
      return of(this.cachedGames.get(cacheKey));
    }

    const safeGameIds = gameIds
      .map((id) => Number(id))
      .filter((id) => !isNaN(id));

    if (safeGameIds.length === 0) {
      return of({ games: [] });
    }

    return this.http
      .post<{ games: any[] }>(`${this.baseUrl}/Games/batch`, {
        gameIds: safeGameIds,
      })
      .pipe(
        tap((response) => {
          this.cachedGames.set(cacheKey, response);
        }),
        catchError((error) => {
          console.error('Error fetching games:', error);
          return of({ games: [] });
        })
      );
  }
}
