import { Component, OnInit } from '@angular/core';
import { Game } from '../shared/interfaces/game.model';
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  games: Game[] = [];
  filteredGames: Game[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  searchTerm: string = '';
  pageNumbers: number[] = [];

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.games = this.gameService.getGames();
    this.filteredGames = this.games;
    this.calculatePages();
    this.filterGames();
  }

  calculatePages(): void {
    const pageCount = Math.ceil(this.filteredGames.length / this.itemsPerPage);
    this.pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  filterGames(): void {
    if (this.searchTerm) {
      this.filteredGames = this.games.filter((game) =>
        game.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredGames = this.games;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  toggleDescription(game: Game): void {
    game.showFullDescription = !game.showFullDescription;
  }
}
