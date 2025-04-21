import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserDataBaseInterface } from '../../shared/interfaces/user-interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
})
export class AccountDetailsComponent implements OnInit {
  user: UserDataBaseInterface | null = null;

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  logout(): void {
    Swal.fire({
      title: 'Logout',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        Swal.fire(
          'Logged Out!',
          'You have been successfully logged out.',
          'success'
        ).then(() => {
          this.router.navigate(['/login']);
        });
      }
    });
  }

  editProfile(): void {
    if (this.user?.id) {
      this.router.navigate(['/account/edit', this.user.id]);
    }
  }

  deleteAccount(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this! All your data will be permanently deleted.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed && this.user?.id) {
        this.authService.deleteAccount(this.user.id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'Your account has been deleted.',
              'success'
            ).then(() => {
              this.router.navigate(['/login']);
            });
          },
          error: (error) => {
            Swal.fire('Error!', 'Failed to delete account.', 'error');
            console.error('Delete failed:', error);
          },
        });
      }
    });
  }
}
