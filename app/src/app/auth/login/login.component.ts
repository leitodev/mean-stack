import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatCard} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatButton,
    MatCard,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatProgressSpinner,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isLoading = false;
  authService = inject(AuthService);
  private readonly router = inject(Router);

  form = new FormGroup({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.minLength(3)]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]}),
  });

  login() {
    console.log('login', this.form.value);

    if (this.form.value.email && this.form.value.password) {
      const {email, password} = this.form.value;

      // TODO need improve it
      this.authService.login(email, password).subscribe({
        next: (data) => {
          console.log('after login', data);
          this.authService.setToken(data.token);
          this.authService.setAuthStatus(true);
          this.authService.watchToken(data.expiresIn);
          this.authService.setAuthDateForStorage(data);
          this.authService.setUser(data.userData);

          this.router.navigate(['']).then(() => {});
        },
        error: (err) => {
          console.log('login error: ', err);
        }
      });

    }
  }

}
