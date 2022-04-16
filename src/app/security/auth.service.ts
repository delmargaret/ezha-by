import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Token } from '../models/token';
import { CredentialsStatus } from '../models/credentialsStatus';
import { ConfigService } from '../services/config.service';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { SetLoginState } from '../state/actions/app.actions';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'main-token';
  private roleKey = 'main-role';
  private userId = 'main-userId';
  private allowedRoles = ['User'];
  private tokenHelper = new JwtHelperService();

  constructor(
    private http: HttpClient,
    private store: Store<AppState>,
    private router: Router
  ) {}

  public hasValidToken(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      return !this.tokenHelper.isTokenExpired(token);
    }
    return false;
  }

  public getUser() {
    const token = localStorage.getItem(this.tokenKey);
    const role = localStorage.getItem(this.roleKey);
    const userId = localStorage.getItem(this.userId);

    return {
      token: token,
      role: role,
      userId: userId,
    };
  }

  public removeUser() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);
    localStorage.removeItem(this.userId);
    window.location.href = '/login';
    this.store.dispatch(new SetLoginState({ isLoggedIn: false }));
  }

  public authorize(email: string, password: string) {
    const data = {
      email: email,
      password: password,
    };

    return this.http.post<Token>(
      ConfigService.addBaseAddress('api/token'),
      data
    );
  }

  public saveUser(token: Token) {
    if (!token) return CredentialsStatus.CREDENTIALS_NOT_FOUND;

    if (!this.allowedRoles.includes(token.role))
      return CredentialsStatus.WRONG_ROLE;

    localStorage.setItem(this.tokenKey, token.token);
    localStorage.setItem(this.roleKey, token.role);
    localStorage.setItem(this.userId, token.userId);

    if (this.hasValidToken()) {
      this.store.dispatch(new SetLoginState({ isLoggedIn: true }));
    }
    return CredentialsStatus.CREDENTIALS_OK;
  }

  public getUserRole(): string | null {
    return localStorage.getItem(this.roleKey);
  }
}
