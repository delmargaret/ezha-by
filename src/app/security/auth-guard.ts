import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SetLoginState } from '../state/actions/app.actions';
import { AppState } from '../state/app.state';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean {
    if (this.authService.hasValidToken()) {
      this.store.dispatch(new SetLoginState({ isLoggedIn: true }));
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }
}
