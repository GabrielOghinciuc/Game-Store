import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { GameDTO } from '../../shared/interfaces/game-dto';
import { extractErrors } from '../../shared/functions/extractErrors';

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
  public errors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.gameForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      picture: [null, [Validators.required]],
      originalPrice: ['', [Validators.required, Validators.min(0.01)]],
      discountedPrice: [0, [Validators.min(0)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      platforms: ['', [Validators.required]],
      genre: ['', [Validators.required]],
      showOnFirstPage: [false],
      showFullDescription: [false],
    });
  }

  onImageSelected(file: File) {
    this.gameForm.patchValue({
      picture: file,
    });
  }

  public onSubmit() {
    if (this.gameForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.apiError = null;
      this.errors = [];

      const formData = new FormData();
      const formValue = this.gameForm.value;

      if (formValue.picture) {
        formData.append('picture', formValue.picture);
        formData.append('image', '/uploads/games/' + formValue.picture.name);
      }

      const platforms = formValue.platforms
        .split(',')
        .map((p: string) => p.trim())
        .filter((p: string) => p.length > 0)
        .join(',');
      formData.append('platforms', platforms);

      Object.keys(formValue).forEach((key) => {
        if (key !== 'platforms' && key !== 'picture') {
          formData.append(key, formValue[key]);
        }
      });

      this.http.post('https://localhost:7262/Games', formData).subscribe({
        next: () => {
          this.router.navigate(['/games']);
        },
        error: (error: HttpErrorResponse) => {
          this.errors = extractErrors(error);
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
