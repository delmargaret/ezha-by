import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/security/auth.service';
import { AppState } from 'src/app/state/app.state';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LoginState } from 'src/app/models/state/loginState';
import { Router } from '@angular/router';
import { OrderState } from 'src/app/models/state/orderState';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit, OnDestroy {
  private $unsubscribe: Subject<void> = new Subject<void>();
  isLoggedIn: boolean = false;
  number: number = 0;

  constructor(
    private store: Store<AppState>,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store
      .select<LoginState>((state) => state.loginState)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((loginState) => {
        this.isLoggedIn = loginState.isLoggedIn;
      });

    this.store
      .select<OrderState>((state) => state.orderState)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((orderState) => {
        this.number = !orderState.orderDishes.length
          ? 0
          : orderState.orderDishes
              .map((x) => x.numberOfDishes)
              .reduce((prev, curr) => prev + curr);
      });
  }

  redirectToMainPage() {
    this.router.navigate(['']);
  }

  redirectToCart() {
    this.router.navigate(['cart']);
  }

  logOut() {
    this.authService.removeUser();
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
