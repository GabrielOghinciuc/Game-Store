import { Component, Inject } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Game } from '../../shared/interfaces/game.model';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Observable } from 'rxjs';
import { DisplayErrorsComponent } from '../display-errors/display-errors.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent {
  cartItems$: Observable<Game[]>;
  showPaymentForm$: Observable<boolean>;
  paymentData = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  };
  errorMessage: string = '';
  errors: string[] = [];

  constructor(
    @Inject(CartService) public cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.showPaymentForm$ = this.cartService.showPaymentForm$;
  }

  removeFromCart(gameId: number) {
    this.cartService.removeFromCart(gameId);
  }

  checkout() {
    const isLoggedIn = this.authService.currentUserSubject.getValue() !== null;
    if (!isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.setShowPaymentForm(true);
  }

  submitPayment() {
    this.errors = [];
    this.errorMessage = '';
    if (
      this.paymentData.cardNumber &&
      this.paymentData.expiryDate &&
      this.paymentData.cvv
    ) {
      const currentUser = this.authService.currentUserSubject.getValue();
      if (!currentUser?.id) {
        this.router.navigate(['/login']);
        return;
      }

      console.log('Starting purchase process for user:', currentUser.id);

      this.cartService.savePurchasedGames(currentUser.id).subscribe({
        next: (response) => {
          console.log('Purchase successful:', response);
          this.cartService.setShowPaymentForm(false);
          this.resetPaymentForm();
          this.router.navigate(['/home']);
        },
        error: (error) => {
          this.errors = [error.message];
          console.error('Purchase failed:', error);
        },
      });
    }
  }

  cancelPayment(): void {
    this.cartService.setShowPaymentForm(false);
    this.resetPaymentForm();
  }

  private resetPaymentForm(): void {
    this.paymentData = {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
    };
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentData.expiryDate = value;
  }
}
