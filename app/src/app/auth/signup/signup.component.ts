import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-signup',
  standalone: true,
    imports: [
        MatButton,
        MatCard,
        MatFormField,
        MatInput,
        MatLabel,
        MatProgressSpinner,
        ReactiveFormsModule
    ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  isLoading = false;
  authService = inject(AuthService);

  form = new FormGroup({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
  });

  signup() {
    console.log('signup', this.form.value);
    if (this.form.value.email && this.form.value.password) {
      const {email, password} = this.form.value;

      this.authService.createUser(email, password).subscribe({
        next: (data) => {
          console.log('after createUser', data);
        },
        error: (err) => {
          // TODO use Global Interceptor for handle such errors
          console.log('signup error: ', err);
        }
      });

    }
  }
}
