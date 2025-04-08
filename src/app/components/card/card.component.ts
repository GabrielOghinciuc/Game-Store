import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Game } from '../../shared/interfaces/game.model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {
  @Input() game!: Game;
  @Output() detailsClick = new EventEmitter<number>();

  toggleDescription(game: Game): void {
    game.showFullDescription = !game.showFullDescription;
  }

  onDetailsClick(): void {
    this.detailsClick.emit(this.game.id);
  }
}
