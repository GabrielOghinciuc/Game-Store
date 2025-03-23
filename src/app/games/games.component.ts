import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Game } from '../shared/interfaces/game.model';
import { GameService } from '../shared/services/game.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  control = new FormControl('');
  suggest: string[] = [
    'The Witcher 3',
    'Cyberpunk 2077',
    'Red Dead Redemption 2',
    'Grand Theft Auto V',
  ];
  filteredSus: Observable<string[]>;
  games: Game[] = [];
  filteredGames: Game[] = [];
  displayedGames: Game[] = []; // Add this new property
  currentPage = 1;
  itemsPerPage = 15;
  searchTerm: string = '';
  pageNumbers: number[] = [];
  errorMessage: string = '';

  constructor(private gameService: GameService) {
    this.filteredSus = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  ngOnInit(): void {
    this.games = this.gameService.getGames();
    this.filteredGames = this.games;
    this.calculatePages();
    this.updateDisplayedGames();
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
    this.currentPage = 1; // Reset to first page when filtering
    this.calculatePages();
    this.updateDisplayedGames();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateDisplayedGames();
  }

  updateDisplayedGames(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedGames = this.filteredGames.slice(startIndex, endIndex);
  }

  toggleDescription(game: Game): void {
    game.showFullDescription = !game.showFullDescription;
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.suggest.filter((street) =>
      this._normalizeValue(street).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}
