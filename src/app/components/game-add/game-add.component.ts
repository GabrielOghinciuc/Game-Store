import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-game-add',
  templateUrl: './game-add.component.html',
  styleUrls: ['./game-add.component.scss'],
})
export class GameAddComponent {
  public gameForm: FormGroup;
  public isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.gameForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      picture: [null, Validators.required],
      originalPrice: ['', [Validators.required, Validators.min(0.01)]],
      discountedPrice: [0, [Validators.min(0)]],
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      platforms: ['', Validators.required],
      genre: ['', Validators.required],
      showOnFirstPage: [false],
      showFullDescription: [false],
    });
  }

  public onImageSelected(file: File) {
    this.gameForm.patchValue({ picture: file });
  }

  public onSubmit() {
    if (this.gameForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;

      const formData = new FormData();
      const formValue = this.gameForm.value;

      if (formValue.picture) {
        formData.append('picture', formValue.picture);
        formData.append('image', '/uploads/games/' + formValue.picture.name);
      }

      const platforms = formValue.platforms
        .split(',')
        .map((p: string) => p.trim())
        .join(',');
      formData.append('platforms', platforms);

      Object.keys(formValue).forEach((key) => {
        if (key !== 'platforms' && key !== 'picture') {
          formData.append(key, formValue[key]);
        }
      });

      this.http.post('https://localhost:7262/Games', formData).subscribe({
        next: () => this.router.navigate(['/games']),
        error: () => (this.isSubmitting = false),
        complete: () => (this.isSubmitting = false),
      });
    } else {
      Object.values(this.gameForm.controls).forEach((control) => {
        control.markAsTouched();
      });
    }
  }

  public resetForm() {
    this.gameForm.reset({
      rating: 5,
      discountedPrice: 0,
      showOnFirstPage: false,
      showFullDescription: false,
    });
  }
}
