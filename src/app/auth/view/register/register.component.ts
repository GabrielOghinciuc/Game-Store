import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm!: FormGroup;

  public hidePassword = true;

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  public initializeForm(): void {
    this.registerForm = this.formBuilder.group({
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

  public getEmailErrorMessage(): string {
    const emailControl = this.registerForm.get('email');

    if (emailControl?.hasError('required')) {
      return 'Email is required';
    }

    if (emailControl?.hasError('email')) {
      return 'Please enter a valid email address';
    }

    return '';
  }

  public getFullNameErrorMessage(): string {
    if (this.registerForm.get('fullName')?.hasError('required')) {
      return 'Full name is required';
    }
    return '';
  }

  public onSubmit(): void {
    if (this.registerForm.valid) {
      this.registerUser();
    } else {
      console.log('Form has errors. Please fix them.');
    }
  }

  private registerUser(): void {
    const formData = this.registerForm.value;
    const userData = this.prepareUserData(formData);

    this.http
      .post('https://localhost:7262/Users/register', userData)
      .subscribe({
        next: (response) => this.handleRegistrationSuccess(response),
        error: (error) => this.handleRegistrationError(error),
      });
  }

  private prepareUserData(formData: any): any {
    return {
      username: formData.username,
      password: formData.password,
      email: formData.email,
      fullName: formData.fullName || '',
      birthDate: new Date(formData.birthDate),
      joinedOn: new Date(),
      lastLogin: new Date(),
      isClient: formData.isClient,
      isGameDeveloper: formData.isGameDeveloper,
      isAdmin: formData.isAdmin,
      profilePicture: formData.profilePicture || '',
    };
  }

  private handleRegistrationSuccess(response: any): void {
    console.log('Registration successful', response);
    this.router.navigate(['/login']);
  }

  private handleRegistrationError(error: any): void {
    console.error('Registration failed', error);
  }
}
