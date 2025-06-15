import { Component, OnInit } from '@angular/core';
import { Game } from '../../shared/interfaces/game.model';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-discount',
  templateUrl: './discount.component.html',
  styleUrl: './discount.component.scss',
})
export class DiscountComponent implements OnInit {
  public gamesLoaded = false;
  public games: Game[] = [];

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadGames();
  }

  public viewGameDetails(gameId: number): void {
    this.router.navigate(['/games/details', gameId]);
  }

  private loadGames(): void {
    this.gamesLoaded = false;
    this.http.get<Game[]>('https://localhost:7262/Games/discounted').subscribe({
      next: (data: Game[]) => {
        this.games = data.map((game: Game) => ({
          ...game,
        }));
        this.gamesLoaded = true;
      },
      error: (error: Error) => {
        console.error('Error fetching featured games:', error);
        this.gamesLoaded = true;
      },
    });
  }
}
