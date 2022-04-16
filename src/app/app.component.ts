import { Component, OnInit } from '@angular/core';
import { CateringFacilitiesService } from './services/catering-facilities.service';
import { AppState } from './state/app.state';
import { Store } from '@ngrx/store';
import {
  SetCateringFacilities,
  SetLoginState,
  SetOrderDishes,
} from './state/actions/app.actions';
import { CateringFacilityStatuses } from './models/cateringFacilityStatuses';
import { AuthService } from './security/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ezha-by';
  isLoading: boolean = true;

  constructor(
    private cateringFacilitiesService: CateringFacilitiesService,
    private store: Store<AppState>,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (this.authService.hasValidToken()) {
      this.store.dispatch(new SetLoginState({ isLoggedIn: true }));
    }

    const order = localStorage.getItem('order');
    if (order) {
      this.store.dispatch(
        new SetOrderDishes({
          orderDishes: JSON.parse(order),
        })
      );
    }

    this.getAllCateringFacilities();
  }

  getAllCateringFacilities() {
    this.cateringFacilitiesService.GetAllCateringFacilities().subscribe({
      next: (cateringFacilities) => {
        this.store.dispatch(
          new SetCateringFacilities({
            allCateringFacilities: cateringFacilities.filter(
              (x) =>
                x.cateringFacilityStatus === CateringFacilityStatuses.Active
            ),
          })
        );
        this.isLoading = false;
      },
      error: (err) => console.log(err),
    });
  }
}
