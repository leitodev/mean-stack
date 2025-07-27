import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);
  private token: string = '';
  private authStatus = new Subject<boolean>();
  private isAuth = false;
  private tokenTimer: any;
  private readonly router = inject(Router);

  constructor() { }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  createUser(email: string, password: string) {
    return this.http.post('http://localhost:3000/api/users/signup', {email: email, password: password});
  }

  login(email: string, password: string) {
    return this.http.post<{token: string, expiresIn: number}>('http://localhost:3000/api/users/login', {email: email, password: password});
  }

  setToken(token: string) {
    this.token = token;
    if (token && token != '') {
      this.authStatus.next(true);
    }
  }

  isAuthStatus() {
    return this.isAuth
  }

  setAuthStatus(status: boolean) {
    this.isAuth = status;
  }

  logout() {
    this.isAuth = false;
    this.authStatus.next(false);
    this.token = '';
    clearTimeout(this.tokenTimer);
    this.clearAuthDate();
    this.router.navigate(['/']).then(() => {});
  }

  getToken() {
    return this.token;
  }

  watchToken(time: number) {
    console.log('duration of timer', time);

    this.tokenTimer = setTimeout(() => {
      this.logout();
      console.log('Token has expired');
    }, time * 1000); // 3600 час в сек нужно в миллисекундах
  }

  autoAuthUser() {
    const authInformation = this.getAuthDate();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuth = true;
      this.authStatus.next(true);
      this.watchToken(expiresIn / 1000);
    }
  }

  setAuthDateForStorage(data: {token: string, expiresIn: number}) {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + data.expiresIn * 1000);
    console.log('expirationDate', expirationDate);
    this.saveAuthDate(data.token, expirationDate);
  }

  private saveAuthDate(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private getAuthDate() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

  private clearAuthDate() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

}
