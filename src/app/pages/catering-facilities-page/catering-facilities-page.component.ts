import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { CateringFacilitiesState } from 'src/app/models/state/cateringFacilitiesState';
import { of, Subject, switchMap, takeUntil, zip } from 'rxjs';
import { Towns } from 'src/app/models/towns';
import { ActivatedRoute, Router } from '@angular/router';
import { CateringFacility } from 'src/app/models/cateringFacility';
import { CateringFacilityTypes } from 'src/app/models/cateringFacilityTypes';
import {
  SetCurrentTown,
  SetOrderDishes,
} from 'src/app/state/actions/app.actions';

@Component({
  selector: 'app-catering-facilities-page',
  templateUrl: './catering-facilities-page.component.html',
  styleUrls: ['./catering-facilities-page.component.scss'],
})
export class CateringFacilitiesPageComponent implements OnInit, OnDestroy {
  private $unsubscribe: Subject<void> = new Subject<void>();
  private town: Towns = Towns.Minsk;
  private allCateringFacilities: CateringFacility[] = [];
  private filters: string[] = [];
  searchValue: string = '';
  cateringFacilities: CateringFacility[] = [];
  filteredCateringFacilities: CateringFacility[] = [];

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute
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
        this.town = parseInt(params['town']);
        this.saveTown(this.town);
        this.allCateringFacilities = [
          ...cateringFacilitiesState.allCateringFacilities,
        ];
        this.cateringFacilities = this.allCateringFacilities.filter(
          (x) => x.town === this.town
        );
        this.filteredCateringFacilities = [...this.cateringFacilities];
      });
  }

  get allTags() {
    let tags: string[] = [];

    this.cateringFacilities
      .map((x) => x.cateringFacilityTags)
      .forEach((x) => {
        x.forEach((tag) => {
          if (!tags.some((x) => x === tag.tagName)) {
            tags.push(tag.tagName);
          }
        });
      });

    return tags;
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

  selectCafe(cafeId: string) {
    this.router.navigate(['./cafe'], {
      queryParams: { id: cafeId },
    });
  }

  searchCafes(value: string) {
    this.searchValue = value.toLocaleLowerCase();
    this.filterCafes();
    this.filteredCateringFacilities = this.filteredCateringFacilities.filter(
      (x) =>
        x.cateringFacilityName.toLocaleLowerCase().includes(this.searchValue)
    );
  }

  applyFilter(event: any, tag: string) {
    const hasClass = event.target.classList.contains('selected');

    if (hasClass) {
      this.filters = this.filters.filter((x) => x !== tag);
      this.filterCafes();
      this.searchCafes(this.searchValue);
      $(event.target).removeClass('selected');
    } else {
      if (!this.filters.some((x) => x === tag)) {
        this.filters.push(tag);
      }
      this.filterCafes();
      this.searchCafes(this.searchValue);
      $(event.target).addClass('selected');
    }
  }

  filterCafes() {
    const allCafes = [...this.cateringFacilities];
    let cafesByType: CateringFacility[] = [];
    let cafes: CateringFacility[] = [];

    if (!this.filters.length) {
      this.filteredCateringFacilities = allCafes;
      return;
    }

    if (this.filters.some((x) => x === 'cafe')) {
      const filtered = allCafes.filter(
        (x) => x.cateringFacilityType !== CateringFacilityTypes.Shop
      );
      filtered.forEach((x) => {
        if (!cafesByType.some((c) => c.id === x.id)) {
          cafesByType.push(x);
        }
      });
    } else if (this.filters.some((x) => x === 'shop')) {
      const filtered = allCafes.filter(
        (x) => x.cateringFacilityType === CateringFacilityTypes.Shop
      );
      filtered.forEach((x) => {
        if (!cafesByType.some((c) => c.id === x.id)) {
          cafesByType.push(x);
        }
      });
    } else {
      cafesByType = [...allCafes];
    }

    const tagFilters = this.filters.filter((x) => x !== 'shop' && x !== 'cafe');
    if (!tagFilters.length) {
      this.filteredCateringFacilities = cafesByType;
      return;
    }

    tagFilters.forEach((filter) => {
      const filtered = cafesByType.filter((x) =>
        x.cateringFacilityTags.some((x) => x.tagName === filter)
      );
      filtered.forEach((x) => {
        if (!cafes.some((c) => c.id === x.id)) {
          cafes.push(x);
        }
      });
    });

    this.filteredCateringFacilities = cafes;
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
