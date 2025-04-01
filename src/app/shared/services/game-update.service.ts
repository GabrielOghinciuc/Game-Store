import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameUpdateService {
  private gameUpdated = new Subject<number>();

  gameUpdated$ = this.gameUpdated.asObservable();

  notifyGameUpdate(gameId: number) {
    this.gameUpdated.next(gameId);
  }
}
