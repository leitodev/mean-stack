import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

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
  private readonly router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
  });

  signup() {
    if (this.form.value.email && this.form.value.password) {
      const {email, password} = this.form.value;

      this.authService.createUser(email, password).subscribe({
        next: (data) => {
          this.autoLogin(email, password);
        },
        error: (err) => {
          // TODO use Global Interceptor for handle such errors
        }
      });

    }
  }

  autoLogin(email: string, password: string) {
    this.authService.login(email, password).subscribe({
      next: (data) => {
        this.authService.setToken(data.token);
        this.authService.setAuthStatus(true);
        this.authService.watchToken(data.expiresIn);
        this.authService.setAuthDateForStorage(data)

        this.router.navigate(['']).then(() => {});
      },
      error: (err) => {
        console.log('login error: ', err);
      }
    });
  }
}
