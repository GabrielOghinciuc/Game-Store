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
  private apiUrl = 'https://localhost:7262/Users';
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

  getFullImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('https://')) {
      return imagePath;
    }
    return `${this.baseUrl}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((response) => {
          console.log('Full login response:', response);
          // Check if boughtGames exists in the response or in user object
          const boughtGames =
            response.boughtGames || response.user?.boughtGames || [];
          console.log('Found bought games:', boughtGames);
          localStorage.setItem('boughtGames', JSON.stringify(boughtGames));

          // Handle user data
          const userData = response.user || response;
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentUser', JSON.stringify(userData));
          }
          this.currentUserSubject.next(userData);
        })
      );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('boughtGames');
      this.cachedGames.clear(); // Clear cache on logout
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

  updateProfile(
    userId: string,
    userData: Partial<UserDataBaseInterface>
  ): Observable<UserDataBaseInterface> {
    return this.http
      .put<UserDataBaseInterface>(
        `${this.apiUrl}/edit-profile/${userId}`,
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

  refreshUserData(updatedUser: UserDataBaseInterface) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
    this.currentUserSubject.next(updatedUser);
  }

  uploadProfileImage(userId: string, file: File) {
    const formData = new FormData();
    const currentUser = this.currentUserSubject.getValue();

    if (file.size > 0) {
      formData.append('ProfilePicture', file);
    }

    if (currentUser) {
      formData.append('Username', currentUser.username);
      formData.append('Email', currentUser.email);
      formData.append('FullName', currentUser.fullName);
      formData.append('BirthDate', currentUser.birthDate.toString());
    }

    return this.http
      .put<UserDataBaseInterface>(
        `${this.apiUrl}/edit-profile/${userId}`,
        formData
      )
      .pipe(
        tap((updatedUser) => {
          this.refreshUserData(updatedUser);
        })
      );
  }

  fetchBoughtGames(gameIds: number[]) {
    const cacheKey = gameIds.sort().join(',');
    if (this.cachedGames.has(cacheKey)) {
      return of(this.cachedGames.get(cacheKey));
    }

    console.log('Fetching games with IDs:', gameIds);
    const safeGameIds = gameIds
      .map((id) => Number(id))
      .filter((id) => !isNaN(id));

    if (safeGameIds.length === 0) {
      return of({ games: [] });
    }

    return this.http
      .post<any>(`${this.baseUrl}/Games/batch`, { gameIds: safeGameIds })
      .pipe(
        tap((response) => {
          this.cachedGames.set(cacheKey, response);
        }),
        catchError((error) => {
          console.error('Error in fetchBoughtGames:', error);
          return throwError(() => error);
        })
      );
  }
}
