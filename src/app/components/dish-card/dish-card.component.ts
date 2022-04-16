import { Component, Input, OnInit } from '@angular/core';
import { Dish } from 'src/app/models/dish';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/state/app.state';
import { OrderDish } from 'src/app/models/orderDish';
import { SetOrderDishes } from 'src/app/state/actions/app.actions';

@Component({
  selector: 'app-dish-card',
  templateUrl: './dish-card.component.html',
  styleUrls: ['./dish-card.component.scss'],
})
export class DishCardComponent implements OnInit {
  @Input() dish: Dish | null = null;
  @Input() orderDishes: OrderDish[] = [];
  @Input() cafeId: string = '';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {}

  get number() {
    return (
      this.orderDishes.find((x) => x.dish.id === this.dish?.id)
        ?.numberOfDishes ?? 1
    );
  }

  get isOrdered() {
    return this.orderDishes?.some((x) => x.dish.id == this.dish?.id);
  }

  get mainPicture() {
    return this.dish?.dishIconUrl
      ? this.dish?.dishIconUrl
      : '../../../assets/19.png';
  }

  addToCart() {
    if (this.dish) {
      let dishes = [...this.orderDishes];
      dishes.push({
        dish: this.dish,
        numberOfDishes: 1,
        cateringFacilityId: this.cafeId,
      });

      this.store.dispatch(
        new SetOrderDishes({
          orderDishes: dishes,
        })
      );
    }
  }

  minusDish() {
    if (this.dish) {
      const dishes = [...this.orderDishes];
      const dish = dishes.find((x) => x.dish.id === this.dish?.id);

      if (dish) {
        const number = dish.numberOfDishes - 1;

        if (number === 0) {
          this.store.dispatch(
            new SetOrderDishes({
              orderDishes: [
                ...dishes.filter((x) => x.dish.id !== this.dish?.id),
              ],
            })
          );
          return;
        }

        const newDish: OrderDish = {
          dish: this.dish,
          numberOfDishes: number,
          cateringFacilityId: this.cafeId,
        };
        this.store.dispatch(
          new SetOrderDishes({
            orderDishes: [
              ...dishes
                .filter((x) => x.dish.id !== this.dish?.id)
                .concat(newDish),
            ],
          })
        );
      }
    }
  }

  plusDish() {
    if (this.dish) {
      const dishes = [...this.orderDishes];
      const dish = dishes.find((x) => x.dish.id === this.dish?.id);

      if (dish) {
        const number = dish.numberOfDishes + 1;
        const newDish: OrderDish = {
          dish: this.dish,
          numberOfDishes: number,
          cateringFacilityId: this.cafeId,
        };
        this.store.dispatch(
          new SetOrderDishes({
            orderDishes: [
              ...dishes
                .filter((x) => x.dish.id !== this.dish?.id)
                .concat(newDish),
            ],
          })
        );
      }
    }
  }
}
