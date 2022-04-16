import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CateringFacility } from 'src/app/models/cateringFacility';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { CateringFacilitiesState } from 'src/app/models/state/cateringFacilitiesState';
import { of, Subject, switchMap, takeUntil, zip } from 'rxjs';
import { Dish } from 'src/app/models/dish';
import { CateringFacilitiesService } from 'src/app/services/catering-facilities.service';
import TownsDict from 'src/app/models/townsDict';
import { CateringFacilityCategory } from 'src/app/models/cateringFacilityCategory';
import { DishStatuses } from 'src/app/models/dishStatuses';
import { OrderState } from 'src/app/models/state/orderState';
import { OrderDish } from 'src/app/models/orderDish';
import { Towns } from 'src/app/models/towns';
import {
  SetCurrentTown,
  SetOrderDishes,
} from 'src/app/state/actions/app.actions';

@Component({
  selector: 'app-catering-facility-page',
  templateUrl: './catering-facility-page.component.html',
  styleUrls: ['./catering-facility-page.component.scss'],
})
export class CateringFacilityPageComponent implements OnInit, OnDestroy {
  private $unsubscribe: Subject<void> = new Subject<void>();
  private filters: string[] = [];
  cateringFacility: CateringFacility | null = null;
  dishes: Dish[] = [];
  filteredDishes: Dish[] = [];
  listIsLoaded: boolean = false;
  towns = TownsDict;
  isLoading: boolean = true;
  orderDishes: OrderDish[] = [];
  id: string = '';

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private cateringFacilitiesService: CateringFacilitiesService
  ) {}

  ngOnInit(): void {
    this.store
      .select<CateringFacilitiesState>((state) => state.cateringFacilitiesState)
      .pipe(
        takeUntil(this.$unsubscribe),
        switchMap((cafesState) => {
          return zip(of(cafesState), this.route.queryParams);
        })
      )
      .subscribe(([cateringFacilitiesState, params]) => {
        const id = params['id'];
        this.id = id;
        this.cateringFacility =
          cateringFacilitiesState.allCateringFacilities.find(
            (x) => x.id === id
          ) ?? null;

        if (!this.listIsLoaded && this.cateringFacility) {
          this.saveTown(this.cateringFacility.town);
          this.getDishes(id);
        }
      });

    this.store
      .select<OrderState>((state) => state.orderState)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((orderState) => {
        this.orderDishes = orderState.orderDishes;
      });
  }

  get mainPicture() {
    return this.cateringFacility?.cateringFacilityIconUrl
      ? `url('${this.cateringFacility?.cateringFacilityIconUrl}')`
      : `linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgb(212 212 212)), url('../../../assets/19.png')`;
  }

  get allCategories() {
    let categories: CateringFacilityCategory[] = [];

    this.dishes
      .map((x) => x.cateringFacilityCategory)
      .forEach((c) => {
        if (!categories.some((x) => x.categoryId === c.categoryId)) {
          categories.push(c);
        }
      });

    return categories;
  }

  saveTown(town: Towns | null = null) {
    const townStr = localStorage.getItem('town');
    if (!townStr) {
      this.store.dispatch(new SetOrderDishes({ orderDishes: [] }));
      this.store.dispatch(new SetCurrentTown({ town: town ?? Towns.Minsk }));
      return;
    }

    const curr = parseInt(townStr);
    if ((curr as Towns) !== town) {
      console.log(curr, town);
      this.store.dispatch(new SetOrderDishes({ orderDishes: [] }));
    }
    this.store.dispatch(new SetCurrentTown({ town: town ?? Towns.Minsk }));
  }

  applyFilter(event: any, categoryId: string) {
    const hasClass = event.target.classList.contains('selected');

    if (hasClass) {
      this.filters = this.filters.filter((x) => x !== categoryId);
      $(event.target).removeClass('selected');
    } else {
      if (!this.filters.some((x) => x === categoryId)) {
        this.filters.push(categoryId);
      }
      $(event.target).addClass('selected');
    }

    if (!this.filters.length) {
      this.filteredDishes = [...this.dishes];
      return;
    }
    this.filteredDishes = [...this.dishes].filter((x) =>
      this.filters.some((f) => f === x.cateringFacilityCategory.categoryId)
    );
  }

  getDishes(cafeId: string) {
    this.cateringFacilitiesService.GetAllDishes(cafeId).subscribe({
      next: (dishes) => {
        this.dishes = dishes.filter(
          (x) => x.dishStatus === DishStatuses.InStock
        );
        this.filteredDishes = [...this.dishes];
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.dishes = [];
        this.filteredDishes = [];
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
