import {Component, inject} from '@angular/core';
import {MatToolbar} from "@angular/material/toolbar";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {MatAnchor} from "@angular/material/button";
import {AuthService} from "../auth/auth.service";
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
  udemyLink = 'https://www.udemy.com/course/angular-2-and-nodejs-the-practical-guide/learn/lecture/10540136#overview';
  udemyLinkName = "udemy (111)";

  authService = inject(AuthService);
  authStatus!: Subscription;
  isAuthenticated = false;

  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthStatus();
    this.authStatus = this.authService.getAuthStatus().subscribe(authStatus => {
      this.isAuthenticated = authStatus;
    });
  }

  ngOnDestroy() {
    this.authStatus.unsubscribe();
  }

}
