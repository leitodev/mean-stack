import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {Router} from "@angular/router";

export interface User { // would be good to move into user service or in another folder
  id: string;
  name: string;
}

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
  userData = {
    id: '',
    name: '',
  };

  constructor() { }

  getAuthStatus(): Observable<boolean> {
    return this.authStatus.asObservable();
  }

  createUser(email: string, password: string) {
    return this.http.post('http://localhost:3000/api/users/signup', {email: email, password: password});
  }

  login(email: string, password: string) {
    return this.http.post<{token: string, expiresIn: number, userData: User}>('http://localhost:3000/api/users/login', {email: email, password: password});
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
    this.userData = {
      id: '',
      name: '',
    };
    this.token = '';
    this.authStatus.next(false);
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
      this.userData = authInformation.userData;
      this.isAuth = true;
      this.authStatus.next(true);
      this.watchToken(expiresIn / 1000);
    }
  }

  setAuthDateForStorage(data: {token: string, expiresIn: number, userData: User}) {
    const now = new Date();
    const expirationDate = new Date(now.getTime() + data.expiresIn * 1000);
    this.saveAuthDate(data.token, expirationDate, data.userData);
  }

  private saveAuthDate(token: string, expirationDate: Date, userData: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private getAuthDate() {
    const token = localStorage.getItem('token');
    let userData = localStorage.getItem('userData');
    let userDataParsed: User = {id: '', name: ''};
    if (userData) {
      userDataParsed = JSON.parse(userData);
    }
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userData: userDataParsed
    }
  }

  private clearAuthDate() {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    localStorage.removeItem('expiration');
  }

  setUser(user: User) {
    this.userData = user;
    this.authStatus.next(true);
  }

  getUser() {
    return this.userData;
  }

}
