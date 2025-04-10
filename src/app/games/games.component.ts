import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subscription, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  startWith,
  map,
} from 'rxjs/operators';
import { Game } from '../shared/interfaces/game.model';
import { extractErrors } from '../shared/functions/extractErrors';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent implements OnInit, OnDestroy {
  public control = new FormControl('');
  public filteredSus: Observable<string[]>;
  public displayedGames: Game[] = [];
  public pageNumbers: number[] = [1];
  public errorMessage: string = '';
  public isLoading: boolean = true;
  public errorMessages: string[] = [];
  public currentPage: number = 1;
  public totalPages: number = 1;
  public hasNext: boolean = false;
  public hasPrevious: boolean = false;
  public genres: string[] = [
    'Action',
    'Adventure',
    'Horror',
    'Sport',
    'Arcade',
    'Survival',
    'Indie',
  ];
  public selectedGenre: string = '';
  private routerSubscription?: Subscription;
  private baseUrl = 'https://localhost:7262/Games';
  private gameNames: string[] = ['Minecraft', 'Counter Strike 2', 'Elden Ring'];

  constructor(private http: HttpClient, private router: Router) {
    this.filteredSus = this.control.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value || ''))
    );
  }

  ngOnInit(): void {
    this.loadGames();
    this.setupSearch();
  }

  private _filter(value: string): string[] {
    const filterValue = this._normalizeValue(value);
    return this.gameNames.filter((name) =>
      this._normalizeValue(name).includes(filterValue)
    );
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  private handleError(error: any) {
    console.error('Error:', error);
    this.errorMessages = extractErrors(error);
    this.isLoading = false;
  }

  private setupSearch() {
    this.routerSubscription = this.control.valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        switchMap((value) => {
          this.isLoading = true;
          this.errorMessages = [];
          if (!value || value.trim() === '') {
            return this.http.get<any>(`${this.baseUrl}/game-list/1`);
          }
          return this.http.get<Game[]>(
            `${this.baseUrl}/search?query=${value.trim()}`
          );
        })
      )
      .subscribe({
        next: (response) => {
          if (Array.isArray(response)) {
            this.displayedGames = response;
            this.gameNames = response.map((game) => game.name);
          } else {
            this.displayedGames = response.games;
            this.currentPage = response.currentPage;
            this.totalPages = response.totalPages;
            this.hasNext = response.hasNext;
            this.hasPrevious = response.hasPrevious;
            this.pageNumbers = Array.from(
              { length: this.totalPages },
              (_, i) => i + 1
            );
            this.gameNames = response.games.map((game: Game) => game.name);
          }
          this.isLoading = false;
        },
        error: (error) => this.handleError(error),
      });
  }

  public loadGames(): void {
    this.isLoading = true;
    this.errorMessages = [];
    this.http
      .get<any>(`${this.baseUrl}/game-list/${this.currentPage}`)
      .subscribe({
        next: (response) => {
          this.displayedGames = response.games;
          this.currentPage = response.currentPage;
          this.totalPages = response.totalPages;
          this.hasNext = response.hasNext;
          this.hasPrevious = response.hasPrevious;
          this.pageNumbers = Array.from(
            { length: this.totalPages },
            (_, i) => i + 1
          );
          this.isLoading = false;
        },
        error: (error) => {
          this.handleError(error);
          this.displayedGames = [];
        },
      });
  }

  public toggleDescription(game: Game): void {
    game.showFullDescription = !game.showFullDescription;
  }

  public viewGameDetails(gameId: number): void {
    this.http.get<Game>(`${this.baseUrl}/${gameId}`).subscribe({
      next: (game) => {
        this.router.navigate(['/games/details', gameId]);
      },
      error: (error) => this.handleError(error),
    });
  }

  public goToPage(page: number): void {
    this.currentPage = page;
    this.loadGames();
  }

  public onGenreSelected(genre: string): void {
    this.isLoading = true;
    this.errorMessages = [];
    if (this.selectedGenre === genre) {
      this.selectedGenre = '';
      this.loadGames();
      return;
    }

    this.selectedGenre = genre;
    this.http.get<Game[]>(`${this.baseUrl}/genre/${genre}`).subscribe({
      next: (games) => {
        this.displayedGames = games;
        this.isLoading = false;
      },
      error: (error) => this.handleError(error),
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
