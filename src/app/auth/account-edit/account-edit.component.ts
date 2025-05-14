import { Component } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss'],
})
export class AccountEditComponent {
  user: any;
  selectedFile?: File;

  constructor(public authService: AuthService, private router: Router) {
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.user = {
          ...user,
          birthDate: new Date(user.birthDate).toISOString().split('T')[0],
        };
      }
    });
  }

  onImageSelected(file: File) {
    this.selectedFile = file;
  }

  updateProfile() {
    if (this.user?.id) {
      const formData = new FormData();

      if (this.selectedFile) {
        formData.append(
          'profilePicture',
          this.selectedFile,
          this.selectedFile.name
        );
      }

      formData.append('username', this.user.username);
      formData.append('email', this.user.email);
      formData.append('fullName', this.user.fullName);
      formData.append('birthDate', this.user.birthDate);

      this.authService.updateProfile(this.user.id, formData).subscribe(() => {
        this.router.navigate(['/account/detail', this.user.id]);
      });
    }
  }

  cancel() {
    this.router.navigate(['/account/detail', this.user?.id || '']);
  }
}
