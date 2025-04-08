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
  private selectedFile: File | null = null;

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
        if (typeof game.platforms === 'string') {
          game.platforms = JSON.parse(game.platforms as string);
        }
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

  onImageSelected(file: File) {
    this.selectedFile = file;
  }

  onSubmit(): void {
    if (!this.game) return;

    this.isLoading = true;
    this.error = null;

    this.updatePlatforms(null);

    const formData = new FormData();

    if (this.selectedFile) {
      formData.append('picture', this.selectedFile);
      this.game.image = '/uploads/games/' + this.selectedFile.name;
    }

    formData.append(
      'platforms',
      this.platformsString
        .split(',')
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
        .join(',')
    );

    Object.keys(this.game).forEach((key) => {
      if (key !== 'platforms') {
        formData.append(key, String(this.game?.[key as keyof Game]));
      }
    });

    this.http
      .put(`https://localhost:7262/Games/edit-game/${this.game.id}`, formData)
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
