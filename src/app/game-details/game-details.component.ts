import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../shared/services/game.service';
import { Game } from '../shared/interfaces/game.model';

@Component({
  selector: 'app-game-details',
  templateUrl: './game-details.component.html',
  styleUrls: ['./game-details.component.scss'],
})
export class GameDetailsComponent implements OnInit {
  game: Game | undefined;
  hoverRating: number = 0;

  constructor(
    private route: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (isNaN(id)) {
      console.error('Invalid game ID');
      return;
    }
    this.game = this.gameService.getGameById(id);
    if (!this.game) {
      console.error('Game not found for ID:', id);
      return;
    }
    console.log('Game loaded:', this.game);
    window.history.replaceState({}, '', `/games/details/${this.game.id}`);
  }

  setRating(rating: number): void {
    if (this.game) {
      this.game = this.gameService.updateGameRating(this.game.id, rating);
    }
  }

  onStarHover(rating: number): void {
    this.hoverRating = rating;
  }

  onStarLeave(): void {
    this.hoverRating = 0;
  }
}
