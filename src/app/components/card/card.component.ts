import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Game } from '../../shared/interfaces/game.model';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../shared/services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() game!: Game;
  @Output() detailsClick = new EventEmitter<number>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  isGameBought(): boolean {
    const currentUser = this.authService.currentUserSubject.getValue();
    if (!currentUser || !currentUser.boughtGames) {
      return false;
    }
    return currentUser.boughtGames.includes(this.game.id);
  }

  toggleDescription(game: Game): void {
    game.showFullDescription = !game.showFullDescription;
  }

  onDetailsClick(): void {
    this.detailsClick.emit(this.game.id);
  }

  buyNow(): void {
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
}
