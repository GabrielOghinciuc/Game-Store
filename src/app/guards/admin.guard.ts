import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  public canActivate() {
    return this.authService.currentUser$.pipe(
      map((user) => {
        if (!user?.isAdmin) {
          this.router.navigate(['/login']);
          return false;
        }
        return true;
      })
    );
  }
}
