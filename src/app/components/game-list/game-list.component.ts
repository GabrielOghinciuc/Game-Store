import { Component, OnInit } from '@angular/core';
import { Game } from '../../shared/interfaces/game.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss'],
})
export class GameListComponent implements OnInit {
  public games: Game[] = [];
  public gamesLoaded = false;
  public isDropping = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadGames();
  }

  private loadGames(): void {
    this.gamesLoaded = false;
    this.http
      .get<Game[]>('https://localhost:7262/Games/featured-games')
      .subscribe({
        next: (data) => {
          this.games = data.map((game) => ({
            ...game,
            showFullDescription: false,
          }));
          this.gamesLoaded = true;
        },
        error: (error) => {
          console.error('Error fetching featured games:', error);
          this.gamesLoaded = true;
        },
      });
  }

  scrollToPopular() {
    const indicator = document.querySelector('.drop-indicator') as HTMLElement;
    const target = document.querySelector('app-carousel') as HTMLElement;

    if (indicator && target) {
      const distance = target.getBoundingClientRect().top - window.scrollY;
      indicator.style.setProperty('--scroll-distance', `${distance}px`);
      this.isDropping = true;

      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(() => {
          this.isDropping = false;
        }, 800);
      }, 400);
    }
  }

  public viewGameDetails(gameId: number): void {
    this.router.navigate(['/games/details', gameId]);
  }
}
