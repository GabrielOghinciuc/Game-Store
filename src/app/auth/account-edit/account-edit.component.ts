import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { UserDataBaseInterface } from '../../shared/interfaces/user-interface';
import { Router } from '@angular/router';

// Add interface for local user with string date
interface EditUserInterface extends Omit<UserDataBaseInterface, 'birthDate'> {
  birthDate: string;
}

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrl: './account-edit.component.scss',
})
export class AccountEditComponent implements OnInit {
  user?: EditUserInterface;
  isLoading = false;
  error?: string;
  selectedFile?: File;

  constructor(public authService: AuthService, private router: Router) {}

  formatDate(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = {
          ...user,
          birthDate: this.formatDate(user.birthDate),
        };
      } else {
        this.user = undefined;
      }
    });
  }

  onImageSelected(file: File) {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.error = 'Please select an image file';
      return;
    }

    this.selectedFile = file;
  }

  onSubmit() {
    if (!this.user || !this.user.id) {
      this.error = 'User ID is missing';
      return;
    }

    this.isLoading = true;
    this.error = undefined;

    const formData = new FormData();
    if (this.selectedFile) {
      formData.append('ProfilePicture', this.selectedFile);
    }

    // Convert string date back to Date object for the API
    formData.append('BirthDate', new Date(this.user.birthDate).toISOString());
    formData.append('Username', this.user.username);
    formData.append('Email', this.user.email);
    formData.append('FullName', this.user.fullName);

    this.authService
      .uploadProfileImage(this.user.id, this.selectedFile || new File([], ''))
      .subscribe({
        next: (updatedUser) => {
          this.isLoading = false;
          // Actualizăm datele utilizatorului înainte de redirectare
          this.authService.refreshUserData(updatedUser);
          this.router.navigate(['/account/detail', this.user!.id]);
        },
        error: (error) => {
          console.error('Update error:', error);
          this.isLoading = false;
          if (error.status === 400) {
            this.error = error.error || 'Validation error';
          } else {
            this.error = error.message || 'Failed to update profile';
          }
        },
      });
  }

  cancel() {
    if (this.user?.id) {
      this.router.navigate(['/account/detail', this.user.id]);
    } else {
      this.router.navigate(['/account/detail']);
    }
  }
}
