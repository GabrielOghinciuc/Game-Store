import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { Game } from '../shared/interfaces/game.model';
import { UserDataBaseInterface } from '../shared/interfaces/user-interface';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit {
  searchControl = new FormControl('');
  filteredGames: string[] = [];

  games: Game[] = [];
  genres = ['Action', 'Adventure', 'Horror', 'Sport', 'Arcade'];

  isLoading = false;
  currentPage = 1;
  totalPages = 1;
  selectedGenre = '';
  currentUser: UserDataBaseInterface | null = null;

  private baseUrl = 'https://localhost:7262/Games';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadGames();

    this.searchControl.valueChanges.subscribe((term) => {
      if (term) {
        this.searchGames(term);
        this.filteredGames = this.games
          .map((game) => game.name)
          .filter((name) => name.toLowerCase().includes(term.toLowerCase()));
      } else {
        this.loadGames();
        this.filteredGames = [];
      }
    });

    this.authService.currentUser$.subscribe(
      (user) => (this.currentUser = user)
    );
  }

  loadGames(): void {
    this.isLoading = true;
    this.http
      .get<any>(`${this.baseUrl}/game-list/${this.currentPage}`)
      .subscribe((response) => {
        this.updateGamesList(response);
      });
  }

  searchGames(term: string): void {
    this.isLoading = true;
    this.http
      .get<any>(`${this.baseUrl}/search?query=${term.trim()}`)
      .subscribe((response) => {
        this.updateGamesList(response);
      });
  }

  onGenreSelect(genre: string): void {
    if (this.selectedGenre === genre) {
      this.selectedGenre = '';
      this.loadGames();
      return;
    }

    this.selectedGenre = genre;
    this.http
      .get<Game[]>(`${this.baseUrl}/genre/${genre}`)
      .subscribe((games) => {
        this.games = games;
        this.isLoading = false;
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadGames();
  }

  onGameSelect(gameId: number): void {
    this.router.navigate(['/games/details', gameId]);
  }

  private updateGamesList(response: any): void {
    if (Array.isArray(response)) {
      this.games = response;
    } else {
      this.games = response.games;
      this.totalPages = response.totalPages;
      this.currentPage = response.currentPage;
    }
    this.isLoading = false;
  }
}
