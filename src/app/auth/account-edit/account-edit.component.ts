import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserDataBaseInterface } from '../../shared/interfaces/user-interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.scss',
})
export class AccountEditComponent implements OnInit {
  public user?: UserDataBaseInterface;
  public isLoading = false;
  public error?: string;
  public selectedFile?: File;

  constructor(public authService: AuthService, private router: Router) {}

  public formatDate(date: Date): string {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  }

  public onBirthDateChange(dateStr: string) {
    if (this.user) {
      this.user.birthDate = new Date(dateStr);
    }
  }

  private ensureDate(date: Date | string | null | undefined): Date {
    if (date instanceof Date) return date;
    return date ? new Date(date) : new Date();
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = {
          ...user,
          birthDate: this.ensureDate(user.birthDate),
        };
      } else {
        this.user = undefined;
      }
    });
  }

  public onImageSelected(file: File) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.error = 'Please select an image file';
      return;
    }

    this.selectedFile = file;
  }

  public onSubmit() {
    if (!this.user || !this.user.id) {
      this.error = 'User ID is missing';
      return;
    }

    this.isLoading = true;
    this.error = undefined;

    const formData = new FormData();

    formData.append('Username', this.user.username);
    formData.append('Email', this.user.email);
    formData.append('FullName', this.user.fullName);

    const birthDate = this.ensureDate(this.user.birthDate);
    formData.append('BirthDate', birthDate.toISOString());

    if (this.selectedFile) {
      formData.append('ProfilePicture', this.selectedFile);
    }

    this.authService.updateProfile(this.user.id, formData).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.router.navigate(['/account/detail', this.user!.id]);
      },
    });
  }

  public cancel() {
    if (this.user?.id) {
      this.router.navigate(['/account/detail', this.user.id]);
    }
  }
}
