import { Component, OnInit } from '@angular/core';
import { Game } from '../../shared/interfaces/game.model';
import { GameService } from '../../shared/services/game.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent implements OnInit {
  games: Game[] = [];
  public gamesLoaded = false;
  isDropping = false;

  constructor(private gameService: GameService) {
    setTimeout(() => {
      this.gamesLoaded = true;
    }, 2000);
  }

  ngOnInit(): void {
    const allGames = this.gameService.getGames();
    this.games = allGames.filter((game) => game.showOnFirstPage);
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

  scrollToPopular() {
    const indicator = document.querySelector('.drop-indicator') as HTMLElement;
    const target = document.querySelector('app-carousel') as HTMLElement;

    if (indicator && target) {
      // Calculate distance to scroll
      const distance = target.getBoundingClientRect().top - window.scrollY;
      indicator.style.setProperty('--scroll-distance', `${distance}px`);

      // Start animation
      this.isDropping = true;

      // Wait for animation to complete then scroll
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Reset animation state
        setTimeout(() => {
          this.isDropping = false;
        }, 800);
      }, 400);
    }
  }
}
