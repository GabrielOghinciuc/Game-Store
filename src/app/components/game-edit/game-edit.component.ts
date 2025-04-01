import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Game } from '../../shared/interfaces/game.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game-edit',
  templateUrl: './game-edit.component.html',
  styleUrl: './game-edit.component.scss',
})
export class GameEditComponent implements OnInit {
  public game: Game | undefined;
  public isLoading: boolean = true;
  public error: string | null = null;
  public platformsString: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<Game>(`https://localhost:7262/Games/${id}`).subscribe({
      next: (game) => {
        this.game = game;
        this.platformsString = game.platforms.join(', ');
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load game';
        this.isLoading = false;
      },
    });
  }

  updatePlatforms(event: any): void {
    if (this.game) {
      this.game.platforms = this.platformsString
        .split(',')
        .map((platform) => platform.trim())
        .filter((platform) => platform.length > 0);
    }
  }

  onSubmit(): void {
    if (!this.game) return;

    this.isLoading = true;
    this.error = null;

    this.updatePlatforms(null);

    this.http
      .put<Game>(
        `https://localhost:7262/Games/edit-game/${this.game.id}`,
        this.game
      )
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/games']);
        },
        error: (err) => {
          this.isLoading = false;
          console.error('Error details:', err);

          if (err.status === 404) {
            this.error = `Game with ID ${this.game?.id} not found`;
          } else if (err.status === 400) {
            this.error = err.error || 'A game with this name already exists';
          } else if (err.status === 500) {
            this.error = 'Server error occurred while editing the game';
          } else {
            this.error = err.error || 'Failed to update game';
          }
        },
      });
  }
}
