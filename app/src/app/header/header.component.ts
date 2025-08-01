import {Component, inject} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatAnchor} from "@angular/material/button";
import {AuthService, User} from "../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatToolbar,
    RouterLink,
    MatAnchor,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  authService = inject(AuthService);
  udemyLink = 'https://www.udemy.com/course/angular-2-and-nodejs-the-practical-guide/learn/lecture/16883014#overview';
  udemyLinkName = "udemy (130)";
  userData = {
    id: '',
    name: '',
  };

  authStatus!: Subscription;
  isAuthenticated = false;

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthStatus();
    this.authStatus = this.authService.getAuthStatus().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
      this.userData = this.authService.getUser(); // TODO fix it

      console.log('[ngOnInit] this.userData', this.userData);
    });
    this.userData = this.authService.getUser();
  }

  ngOnDestroy() {
    this.authStatus.unsubscribe();
  }

}
