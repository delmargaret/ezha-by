import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrderDish } from 'src/app/models/orderDish';
import { AppState } from 'src/app/state/app.state';
import { Store } from '@ngrx/store';
import { CateringFacilitiesState } from 'src/app/models/state/cateringFacilitiesState';
import { Subject, takeUntil } from 'rxjs';
import { CateringFacility } from 'src/app/models/cateringFacility';
import { SetOrderDishes } from 'src/app/state/actions/app.actions';
import { OrderState } from 'src/app/models/state/orderState';
import TownsDict from 'src/app/models/townsDict';
import { Towns } from 'src/app/models/towns';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PaymentTypes } from 'src/app/models/paymentTypes';
import { OrdersService } from 'src/app/services/orders.service';
import { OrderLine } from 'src/app/models/orderLine';
import { Router } from '@angular/router';
import { TownState } from 'src/app/models/state/townState';
import { AuthService } from 'src/app/security/auth.service';
import { UsersService } from 'src/app/services/users.service';

interface GroupedOrderDish {
  cafe: CateringFacility;
  dishes: OrderDish[];
}

@Component({
  selector: 'app-shopping-cart-page',
  templateUrl: './shopping-cart-page.component.html',
  styleUrls: ['./shopping-cart-page.component.scss'],
})
export class ShoppingCartPageComponent implements OnInit, OnDestroy {
  private $unsubscribe: Subject<void> = new Subject<void>();
  cartForm: FormGroup;
  orderDishes: OrderDish[] = [];
  cafes: CateringFacility[] = [];
  groupedOrderDishes: GroupedOrderDish[] = [];
  townName: string = TownsDict[Towns.Minsk];
  town: Towns = Towns.Minsk;
  paymentType: PaymentTypes = PaymentTypes.Cash;
  userId: string | null = null;

  constructor(
    private store: Store<AppState>,
    private ordersService: OrdersService,
    private router: Router,
    private authService: AuthService,
    private usersService: UsersService
  ) {
    this.cartForm = new FormGroup({
      name: new FormControl('', Validators.required),
      surname: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required]),
      patronymic: new FormControl(),
      street: new FormControl(),
      house: new FormControl(),
      flat: new FormControl(),
      payment: new FormControl('0'),
      comment: new FormControl(),
    });
  }

  get patronymic() {
    return this.cartForm.get('patronymic');
  }

  get name() {
    return this.cartForm.get('name');
  }

  get surname() {
    return this.cartForm.get('surname');
  }

  get street() {
    return this.cartForm.get('street');
  }

  get phone() {
    return this.cartForm.get('phone');
  }

  get house() {
    return this.cartForm.get('house');
  }

  get flat() {
    return this.cartForm.get('flat');
  }

  get payment() {
    return this.cartForm.get('payment');
  }

  get comment() {
    return this.cartForm.get('comment');
  }

  get price() {
    let price = 0;
    this.groupedOrderDishes.forEach((group) => {
      group.dishes.forEach(
        (x) => (price = price + x.dish.price * x.numberOfDishes)
      );
    });
    return price;
  }

  get delivery() {
    let delivery = 0;
    this.groupedOrderDishes.forEach(
      (group) => (delivery = delivery + group.cafe.deliveryPrice)
    );
    return delivery;
  }

  ngOnInit(): void {
    this.town = parseInt(localStorage.getItem('town') ?? '0');
    this.townName = TownsDict[this.town];

    this.userId = this.authService.getUser().userId;
    if (this.userId) {
      this.usersService.GetUser(this.userId).subscribe({
        next: (user) => {
          this.cartForm.setValue({
            name: user.name,
            surname: user.surname,
            phone: user.phone,
            patronymic: user.patronymic,
            street: user.town === this.town ? user.street : '',
            house: user.town === this.town ? user.houseNumber : '',
            flat: user.town === this.town ? user.flatNumber : '',
            payment: '0',
            comment: '',
          });
        },
        error: (err) => console.log(err),
      });
    }

    this.store
      .select<OrderState>((state) => state.orderState)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((orderState) => {
        this.orderDishes = orderState.orderDishes;
        this.groupByCafeId(this.cafes);
      });

    this.store
      .select<CateringFacilitiesState>((state) => state.cateringFacilitiesState)
      .pipe(takeUntil(this.$unsubscribe))
      .subscribe((cateringFacilitiesState) => {
        this.cafes = cateringFacilitiesState.allCateringFacilities;
        this.groupByCafeId(cateringFacilitiesState.allCateringFacilities);
      });
  }

  groupByCafeId(cateringFacilities: CateringFacility[]) {
    let result: GroupedOrderDish[] = [];
    this.orderDishes.forEach((dish) => {
      const cafe = cateringFacilities.find(
        (x) => x.id === dish.cateringFacilityId
      );
      if (cafe) {
        const group = result.find((x) => x.cafe.id === cafe?.id) ?? null;
        if (!group) {
          result.push({ cafe: cafe, dishes: ([] as OrderDish[]).concat(dish) });
          return;
        }

        group.dishes.push(dish);
      }
    });
    result.forEach((r) =>
      r.dishes.sort((a, b) => a.dish.dishName.localeCompare(b.dish.dishName))
    );
    this.groupedOrderDishes = [...result];
  }

  deleteDish(dish: OrderDish) {
    const dishes = [...this.orderDishes];
    this.store.dispatch(
      new SetOrderDishes({
        orderDishes: [...dishes.filter((x) => x.dish.id !== dish?.dish.id)],
      })
    );
  }

  minusDish(dish: OrderDish) {
    const dishes = [...this.orderDishes];
    if (dish) {
      const number = dish.numberOfDishes - 1;

      if (number === 0) {
        this.store.dispatch(
          new SetOrderDishes({
            orderDishes: [...dishes.filter((x) => x.dish.id !== dish?.dish.id)],
          })
        );
        return;
      }

      const newDish: OrderDish = {
        dish: dish.dish,
        numberOfDishes: number,
        cateringFacilityId: dish.cateringFacilityId,
      };
      this.store.dispatch(
        new SetOrderDishes({
          orderDishes: [
            ...dishes
              .filter((x) => x.dish.id !== dish.dish?.id)
              .concat(newDish),
          ],
        })
      );
    }
  }

  plusDish(dish: OrderDish) {
    const dishes = [...this.orderDishes];
    if (dish) {
      const number = dish.numberOfDishes + 1;
      const newDish: OrderDish = {
        dish: dish.dish,
        numberOfDishes: number,
        cateringFacilityId: dish.cateringFacilityId,
      };
      this.store.dispatch(
        new SetOrderDishes({
          orderDishes: [
            ...dishes
              .filter((x) => x.dish.id !== dish.dish?.id)
              .concat(newDish),
          ],
        })
      );
    }
  }

  onSubmit(event: any) {
    event.preventDefault();
    event.stopPropagation();

    if (this.cartForm?.invalid) {
      this.patronymic?.invalid && this.patronymic.markAsDirty();
      this.name?.invalid && this.name.markAsDirty();
      this.surname?.invalid && this.surname.markAsDirty();
      this.phone?.invalid && this.phone.markAsDirty();
      this.street?.invalid && this.street.markAsDirty();
      this.house?.invalid && this.house.markAsDirty();
      this.flat?.invalid && this.flat.markAsDirty();
      this.payment?.invalid && this.payment.markAsDirty();
      this.comment?.invalid && this.comment.markAsDirty();
      return;
    }

    var orders: OrderLine[] = this.orderDishes.map((x) => {
      return {
        dishId: x.dish.id,
        numberOfDishes: x.numberOfDishes,
      };
    });

    this.ordersService
      .AddOrder({
        name: this.name?.value,
        surname: this.surname?.value,
        patronymic: this.patronymic?.value,
        phone: this.phone?.value,
        street: this.street?.value,
        town: this.town,
        houseNumber: this.house?.value,
        flatNumber: this.flat?.value,
        paymentType: this.payment?.value,
        comment: this.comment?.value,
        totalPrice: this.price + this.delivery,
        userId: this.userId,
        orderDishes: orders,
      })
      .subscribe({
        next: () => {
          this.store.dispatch(new SetOrderDishes({ orderDishes: [] }));
          this.router.navigate(['cart/success']);
        },
        error: (e) => {
          this.store.dispatch(new SetOrderDishes({ orderDishes: [] }));
          this.router.navigate(['cart/error']);
          console.error(e);
        },
      });
  }

  ngOnDestroy(): void {
    this.$unsubscribe.next();
    this.$unsubscribe.complete();
  }
}
