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
  game: Game | undefined;
  isLoading: boolean = true;
  error: string | null = null;
  platformsString: string = '';
  selectedFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const gameId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadGame(gameId);
  }

  private loadGame(id: number): void {
    this.http.get<Game>(`https://localhost:7262/Games/${id}`).subscribe({
      next: (game) => {
        this.game = game;
        this.platformsString = Array.isArray(game.platforms)
          ? game.platforms.join(', ')
          : JSON.parse(game.platforms as string).join(', ');
        this.isLoading = false;
      },
      error: () => {
        this.error = 'Could not load game. Please try again.';
        this.isLoading = false;
      },
    });
  }

  updatePlatforms(): void {
    if (this.game) {
      this.game.platforms = this.platformsString
        .split(',')
        .map((platform) => platform.trim())
        .filter((platform) => platform.length > 0);
    }
  }

  onImageSelected(file: File): void {
    this.selectedFile = file;
  }

  onSubmit(): void {
    if (!this.game) return;

    this.isLoading = true;
    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
      this.game.image = '/uploads/games/' + this.selectedFile.name;
    }

    formData.append('platforms', this.platformsString);

    Object.keys(this.game).forEach((key) => {
      if (key !== 'platforms') {
        formData.append(key, String(this.game?.[key as keyof Game]));
      }
    });

    this.http
      .put(`https://localhost:7262/Games/edit-game/${this.game.id}`, formData)
      .subscribe({
        next: () => {
          this.router.navigate(['/games']);
        },
        error: () => {
          this.error = 'Failed to update game. Please try again.';
          this.isLoading = false;
        },
      });
  }
}
