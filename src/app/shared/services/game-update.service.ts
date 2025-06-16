import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameUpdateService {
  private gameUpdated = new Subject<number>();

  public gameUpdated$ = this.gameUpdated.asObservable();

  public notifyGameUpdate(gameId: number) {
    this.gameUpdated.next(gameId);
  }
}
