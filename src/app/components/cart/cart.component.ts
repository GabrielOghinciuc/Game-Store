import { Component } from '@angular/core';
import { CartService } from '../../shared/services/cart.service';
import { Game } from '../../shared/interfaces/game.model';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { Observable } from 'rxjs';

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

  constructor(
    public cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {
    this.cartItems$ = this.cartService.cartItems$;
    this.showPaymentForm$ = this.cartService.showPaymentForm$;
  }

  public removeFromCart(gameId: number) {
    this.cartService.removeFromCart(gameId);
  }

  public checkout() {
    if (!this.authService.currentUserSubject.getValue()) {
      this.router.navigate(['/login']);
      return;
    }
    this.cartService.setShowPaymentForm(true);
  }

  public submitPayment() {
    if (this.isPaymentDataValid()) {
      const currentUser = this.authService.currentUserSubject.getValue();

      if (!currentUser?.id) {
        this.router.navigate(['/login']);
        return;
      }

      this.cartService.savePurchasedGames(currentUser.id).subscribe({
        next: () => {
          this.cartService.setShowPaymentForm(false);
          this.resetPaymentForm();
          this.router.navigate(['/home']);
        },
      });
    }
  }

  public cancelPayment(): void {
    this.cartService.setShowPaymentForm(false);
    this.resetPaymentForm();
  }

  private resetPaymentForm(): void {
    this.paymentData = { cardNumber: '', expiryDate: '', cvv: '' };
  }

  private isPaymentDataValid(): boolean {
    return !!(
      this.paymentData.cardNumber &&
      this.paymentData.expiryDate &&
      this.paymentData.cvv
    );
  }

  public formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentData.expiryDate = value;
  }
}
