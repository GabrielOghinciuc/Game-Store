import { Component, OnInit } from '@angular/core';
import { Game } from '../../shared/interfaces/game.model';
import { GameService } from '../../shared/services/game.service';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent implements OnInit {
  games: Game[] = [];
  public gamesLoaded = false;

  constructor(private gameService: GameService) {
    setTimeout(() => {
      this.gamesLoaded = true;
    }, 2000);
  }

  ngOnInit(): void {
    if (typeof localStorage !== 'undefined') {
    }
    this.games = this.gameService
      .getGames()
      .filter((game) => game.showOnFirstPage);
  }

  toggleDescription(game: Game): void {
    game.showFullDescription = !game.showFullDescription;
  }

  getShortDescription(description: string): string {
    if (description.length > 100) {
      return description.substring(0, 100) + '...';
    }
    return description;
  }
}
