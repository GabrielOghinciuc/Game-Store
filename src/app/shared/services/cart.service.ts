import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Game } from '../interfaces/game.model';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private shoppingCartState = new BehaviorSubject<Game[]>([]);
  public cartItems$ = this.shoppingCartState.asObservable();

  private showPaymentForm = new BehaviorSubject<boolean>(false);
  public showPaymentForm$ = this.showPaymentForm.asObservable();

  constructor(private http: HttpClient) {}

  addToCart(game: Game): void {
    const currentCart = this.shoppingCartState.value;
    if (!currentCart.some((item) => item.id === game.id)) {
      this.shoppingCartState.next([...currentCart, game]);
    }
  }

  removeFromCart(gameId: number): void {
    const updatedCart = this.shoppingCartState.value.filter(
      (item) => item.id !== gameId
    );
    this.shoppingCartState.next(updatedCart);
  }

  savePurchasedGames(userId: string): Observable<any> {
    const gameIds = this.shoppingCartState.value.map((game) => game.id);
    return this.http
      .post(`https://localhost:7262/Users/${userId}/add-games`, gameIds)
      .pipe(
        tap(() => this.clearCart()),
        catchError((error) => this.handlePurchaseError(error))
      );
  }

  clearCart(): void {
    this.shoppingCartState.next([]);
  }

  setShowPaymentForm(show: boolean): void {
    this.showPaymentForm.next(show);
  }

  getCartTotal(): number {
    return this.shoppingCartState.value.reduce(
      (total, game) => total + (game.discountedPrice || game.originalPrice),
      0
    );
  }

  private handlePurchaseError(error: any): Observable<any> {
    if (error.status === 200) {
      this.clearCart();
      return new Observable((subscriber) => {
        subscriber.next({ success: true, message: 'Purchase successful' });
        subscriber.complete();
      });
    }
    return new Observable((subscriber) => {
      subscriber.next({
        success: false,
        message: 'Purchase failed. Please try again.',
      });
      subscriber.complete();
    });
  }
}
