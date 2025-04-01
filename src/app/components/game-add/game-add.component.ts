import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.scss'],
})
export class GameAddComponent {
  public gameForm: FormGroup;
  public showErrors = false;
  public apiError: string | null = null;
  public isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.gameForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      image: ['', [Validators.required]],
      originalPrice: ['', [Validators.required, Validators.min(0.01)]],
      discountedPrice: [0, [Validators.min(0)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      platforms: ['', [Validators.required]],
      genre: ['', [Validators.required]],
      showOnFirstPage: [false],
      showFullDescription: [false],
    });
  }

  public onSubmit() {
    if (this.gameForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.apiError = null;

      const formValue = this.gameForm.value;
      const gameData = {
        ...formValue,
        platforms: formValue.platforms
          .split(',')
          .map((p: string) => p.trim())
          .filter((p: string) => p),
        originalPrice: Number(formValue.originalPrice),
        discountedPrice: Number(formValue.discountedPrice || 0),
        rating: Number(formValue.rating),
      };

      this.http.post('https://localhost:7262/Games', gameData).subscribe({
        next: () => {
          this.router.navigate(['/games']);
        },
        error: (error: HttpErrorResponse) => {
          this.apiError =
            error.error?.message || 'An error occurred while adding the game';
          this.isSubmitting = false;
          window.scrollTo(0, 0);
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      this.showErrors = true;
      Object.keys(this.gameForm.controls).forEach((key) => {
        const control = this.gameForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      window.scrollTo(0, 0);
    }
  }

  public resetForm(): void {
    this.gameForm.reset({
      rating: 5,
      discountedPrice: 0,
      showOnFirstPage: false,
      showFullDescription: false,
    });
    this.showErrors = false;
    this.apiError = null;
  }
}
