import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent {
  user: any;
  boughtGames: any[] = [];

  constructor(public authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      this.loadBoughtGames();
    });
  }

  loadBoughtGames() {
    const savedGames = localStorage.getItem('boughtGames');
    if (savedGames) {
      const gameIds = JSON.parse(savedGames);
      if (gameIds.length > 0) {
        this.authService.fetchBoughtGames(gameIds).subscribe((games) => {
          this.boughtGames = games || [];
        });
      }
    }
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
