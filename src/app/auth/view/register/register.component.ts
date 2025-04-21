import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { UserDataBaseInterface } from '../../../shared/interfaces/user-interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      birthDate: ['', Validators.required],
      isClient: [true],
      isGameDeveloper: [false],
      isAdmin: [false],
      profilePicture: [''],
    });
  }

  getEmailErrorMessage() {
    if (this.registerForm.get('email')?.hasError('required')) {
      return 'Email is required';
    }
    return this.registerForm.get('email')?.hasError('email')
      ? 'Invalid email format'
      : '';
  }

  getFullNameErrorMessage() {
    if (this.registerForm.get('fullName')?.hasError('required')) {
      return 'Full name is required';
    }
    return '';
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      const newUser = {
        username: formValue.username,
        password: formValue.password,
        email: formValue.email,
        fullName: formValue.fullName || '',
        birthDate: new Date(formValue.birthDate),
        joinedOn: new Date(),
        lastLogin: new Date(),
        isClient: formValue.isClient,
        isGameDeveloper: formValue.isGameDeveloper,
        isAdmin: formValue.isAdmin,
        profilePicture: formValue.profilePicture || '',
      };

      this.http
        .post('https://localhost:7262/Users/register', newUser)
        .subscribe({
          next: (response) => {
            console.log('Registration successful', response);
            this.router.navigate(['/login']);
          },
          error: (error) => {
            console.error('Registration failed', error);
          },
        });
    }
  }
}
