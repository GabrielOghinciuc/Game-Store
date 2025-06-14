import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../../shared/interfaces/game.model';
import { HttpClient } from '@angular/common/http';
import { GameUpdateService } from '../../shared/services/game-update.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../shared/services/auth.service';
import { CartService } from '../../shared/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDataBaseInterface } from '../../shared/interfaces/user-interface';
@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
})
export class GameDetailsComponent implements OnInit {
  public game: Game | undefined;
  public hoverRating: number = 0;
  public isLoading: boolean = true;
  public error: string | null = null;
  currentUser: UserDataBaseInterface | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private gameUpdateService: GameUpdateService,
    private authService: AuthService,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      if (isNaN(id)) {
        this.error = 'Invalid game ID';
        this.isLoading = false;
        return;
      }

      this.loadGameDetails(id);
    });

    this.gameUpdateService.gameUpdated$.subscribe((updatedGameId) => {
      if (this.game && this.game.id === updatedGameId) {
        this.loadGameDetails(updatedGameId);
      }
    });
  }

  private loadGameDetails(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.http.get<Game>(`https://localhost:7262/Games/${id}`).subscribe({
      next: (game) => {
        this.game = game;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to load game details';
        this.isLoading = false;
        console.error('Error loading game:', error);
      },
    });
  }

  public setRating(rating: number): void {
    if (this.game) {
      this.http
        .post(`https://localhost:7262/Games/${this.game.id}/review`, { rating })
        .subscribe({
          next: (response: any) => {
            if (this.game) {
              this.game.rating = response.averageRating;
              this.loadGameDetails(this.game.id);
            }
          },
          error: (error) => {
            console.error('Error updating rating:', error);
            this.snackBar.open('Failed to update rating', 'Close', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
            });
          },
        });
    }
  }

  public navigateToEdit(): void {
    if (this.game) {
      this.router.navigate(['/games/edit', this.game.id]);
    }
  }

  public deleteGame(): void {
    if (!this.game) return;

    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete this game?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes!',
      cancelButtonText: 'No!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .delete(`https://localhost:7262/Games/${this.game!.id}`)
          .subscribe({
            next: () => {
              this.router.navigate(['/games']);
            },
            error: (error) => {
              console.error('Error deleting game:', error);
            },
          });
      }
    });
  }

  buyNow(): void {
    if (!this.game) {
      return;
    }

    const isLoggedIn = this.authService.currentUserSubject.getValue() !== null;
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.cartService.addToCart(this.game);
    this.snackBar.open('Game added to cart!', 'Close', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  isGameBought(): boolean {
    const currentUser = this.authService.currentUserSubject.getValue();
    if (!currentUser || !currentUser.boughtGames || !this.game) {
      return false;
    }
    return currentUser.boughtGames.includes(this.game.id);
  }
}
