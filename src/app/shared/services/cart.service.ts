import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  from,
  forkJoin,
  throwError,
  of,
} from 'rxjs';
import { Game } from '../interfaces/game.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { tap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private apiUrl = environment.apiURL;
  private cartItems = new BehaviorSubject<Game[]>([]);
  public cartItems$ = this.cartItems.asObservable();
  private showPaymentForm = new BehaviorSubject<boolean>(false);
  public showPaymentForm$ = this.showPaymentForm.asObservable();

  constructor(private http: HttpClient) {}

  addToCart(game: Game) {
    const currentItems = this.cartItems.getValue();
    if (!currentItems.find((item) => item.id === game.id)) {
      this.cartItems.next([...currentItems, game]);
    }
  }

  removeFromCart(gameId: number) {
    const currentItems = this.cartItems.getValue();
    this.cartItems.next(currentItems.filter((item) => item.id !== gameId));
  }

  savePurchasedGames(userId: string): Observable<any> {
    const cartItems = this.cartItems.getValue();
    const gameIds = cartItems.map((game) => game.id);
    const url = `https://localhost:7262/Users/${userId}/add-games`;

    return this.http
      .post(url, gameIds, {
        headers: { 'Content-Type': 'application/json' },
        responseType: 'text',
      })
      .pipe(
        tap((response) => {
          console.log('Server response:', response);
          this.clearCart();
        }),
        catchError((error) => {
          console.error('Purchase error:', error);

          if (error.status === 200) {
            this.clearCart();
            return of({ success: true, message: error.error.text });
          }

          return throwError(() => ({
            message:
              error.error?.message || error.error.text || 'Purchase failed',
          }));
        })
      );
  }

  clearCart() {
    this.cartItems.next([]);
  }

  setShowPaymentForm(show: boolean) {
    this.showPaymentForm.next(show);
  }

  getCartTotal(): number {
    return this.cartItems.getValue().reduce((total, item) => {
      return total + (item.discountedPrice || item.originalPrice);
    }, 0);
  }
}
