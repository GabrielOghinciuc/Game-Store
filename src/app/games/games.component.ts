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

  private setupSearch() {
    this.routerSubscription = this.control.valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged(),
        switchMap((value) => {
          this.isLoading = true;
          if (!value || value.trim() === '') {
            return this.http.get<Game[]>(`${this.baseUrl}`);
          }
          return this.http.get<Game[]>(
            `${this.baseUrl}/search?query=${value.trim()}`
          );
        })
      )
      .subscribe({
        next: (games) => {
          this.displayedGames = games;
          this.gameNames = games.map((game) => game.name);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching games:', error);
          this.errorMessage = 'Failed to load games';
          this.isLoading = false;
        },
      });
  }

  public loadGames(): void {
    this.isLoading = true;
    this.http.get<Game[]>(`${this.baseUrl}`).subscribe({
      next: (games) => {
        this.displayedGames = games;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load games';
        this.displayedGames = [];
        this.isLoading = false;
      },
    });
  }

  public toggleDescription(game: Game): void {
    game.showFullDescription = !game.showFullDescription;
  }

  public viewGameDetails(gameId: number): void {
    this.router.navigate(['/games/details', gameId]);
  }

  public goToPage(page: number): void {
    this.loadGames();
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
