import { HttpErrorResponse } from '@angular/common/http';
import { HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

interface UserDto {
  username: string;
  email: string;
  type: 'user' | 'admin';
  password: string;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  isSubmitting: boolean = false;
  isSuccess: boolean = false;
  isError: boolean = false;
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      username: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(24),
        ],
      }),
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      type: new FormControl('user', {
        validators: [Validators.required, Validators.pattern(/^(user|admin)$/)],
      }),
      password: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(24),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{3,}$/),
        ],
      }),
    });
  }

  // CODE HERE
  //
  // I want to be able to create a new user for the application. Implement a reactive form that I can submit
  //
  // Form:
  // - username (required, min 3, max 24 characters)
  // - email (required, valid email address)
  // - type (required, select dropdown with either 'user' or 'admin')
  // - password (required, min 5, max 24 characters, upper and lower case, at least one special character)
  //
  // Requirements:
  // The form should submit a valid UserDto object (call createUser() function)
  // The submit button should be disabled if the form is invalid
  // The submit button should be disabled while the submit request is pending
  // If the request fails the button must become submittable again (error message must not be displayed)
  // Errors should be displayed under each input if not valid
  //
  // Futher Notes:
  // Styling is not important, use default HTML elements (no angular material or bootstrap)

  ngOnInit() {}

  private async createUser(user: UserDto) {
    if (this.isSubmitting) {
      return;
    }

    this.isSuccess = false;
    this.isError = false;
    this.isSubmitting = true;

    // Backend call happening here.
    this.http
      .post('http://localhost:3000/register', this.registerForm.getRawValue())
      .subscribe({
        next: (response) => this.processSuccess(response),
        error: (response) => this.processError(response),
      });
  }

  private processSuccess(response: any): void {
    console.log(response);
    this.isSuccess = true;
    this.isSubmitting = false;
  }

  private processError(response: HttpErrorResponse): void {
    console.error(response);
    this.isError = true;
    this.isSubmitting = false;
  }
}
