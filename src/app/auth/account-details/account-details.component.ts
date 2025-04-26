import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { UserDataBaseInterface } from '../../shared/interfaces/user-interface';
import Swal from 'sweetalert2';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountDetailsComponent implements OnInit, OnDestroy {
  user: UserDataBaseInterface | null = null;
  boughtGames: any[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    public authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user) {
          this.user = user;
          this.loadBoughtGames();
          this.cdr.markForCheck();
        }
      });
  }

  loadBoughtGames(): void {
    const boughtGamesString = localStorage.getItem('boughtGames');

    if (!boughtGamesString) {
      this.boughtGames = [];
      return;
    }

    try {
      let boughtGamesIds = JSON.parse(boughtGamesString);

      if (typeof boughtGamesIds === 'string') {
        boughtGamesIds = boughtGamesIds.split(',').map(Number);
      }

      if (!Array.isArray(boughtGamesIds)) {
        this.boughtGames = [];
        return;
      }

      const validGameIds = boughtGamesIds
        .map((id) => Number(id))
        .filter((id) => !isNaN(id) && id > 0);

      if (validGameIds.length > 0) {
        this.authService
          .fetchBoughtGames(validGameIds)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              if (response && response.games) {
                this.boughtGames = response.games;
                this.cdr.markForCheck();
              }
            },
            error: (error) => {
              Swal.fire('Error', 'Failed to load your games library', 'error');
              this.boughtGames = [];
              this.cdr.markForCheck();
            },
          });
      }
    } catch (error) {
      this.boughtGames = [];
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
