import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserDataBaseInterface } from '../../shared/interfaces/user-interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent {
  user: UserDataBaseInterface | null = null;
  boughtGames: any[] = [];

  constructor(public authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      if (
        user &&
        Array.isArray(user.boughtGames) &&
        user.boughtGames.length > 0
      ) {
        this.loadBoughtGames(user.boughtGames);
      } else {
        this.boughtGames = [];
      }
    });
  }

  loadBoughtGames(gameIds: number[]) {
    this.authService.fetchBoughtGames(gameIds).subscribe({
      next: (response) => {
        this.boughtGames = response.games || [];
      },
      error: (error) => {
        console.error('Error loading games:', error);
        this.boughtGames = [];
      },
    });
  }

  logout() {
    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  editProfile() {
    this.router.navigate(['/account/edit', this.user?.id]);
  }

  deleteAccount() {
    Swal.fire({
      title: 'Delete Account?',
      text: 'This cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed && this.user?.id) {
        this.authService.deleteAccount(this.user.id).subscribe(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }
}
