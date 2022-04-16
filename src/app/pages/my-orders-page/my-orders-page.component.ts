import { Component, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { Order } from 'src/app/models/order';
import { UserOrder } from 'src/app/models/userOrder';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-my-orders-page',
  templateUrl: './my-orders-page.component.html',
  styleUrls: ['./my-orders-page.component.scss'],
})
export class MyOrdersPageComponent implements OnInit {
  orders: UserOrder[] = [];
  filteredOrders: UserOrder[] = [];
  isLoading: boolean = true;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.ordersService.GetUserOrders().subscribe({
      next: (orders) => {
        this.orders = [...orders];
        this.filteredOrders = [...orders];
        this.filteredOrders.forEach((o) => {
          o.orderDishes.sort((a, b) =>
            a.cateringFacilityName.localeCompare(b.cateringFacilityName)
          );
        });
        this.filteredOrders = [...this.filteredOrders].sort(
          (a: UserOrder, b: UserOrder) =>
            new Date(b.orderDateTime).valueOf() -
            new Date(a.orderDateTime).valueOf()
        );
        this.isLoading = false;
      },
      error: (err) => console.log(err),
    });
  }

  convertDate(date: string): string {
    return dayjs(date).format('DD.MM.YYYY HH:mm');
  }

  applyFilter(event: any, type: string) {
    const hasClass = event.target.classList.contains('selected');
    $(document).find('.datetype').removeClass('selected');
    $(document).find('.datetype div').removeClass('selected');

    if (hasClass) {
      this.filteredOrders = [...this.orders];
      $(event.target).removeClass('selected');
    } else {
      switch (type) {
        case 'all':
        default:
          this.filteredOrders = [...this.orders];
          break;
        case 'week':
          this.filteredOrders = [...this.orders].filter((o) =>
            dayjs(o.orderDateTime).isAfter(dayjs().subtract(1, 'week'))
          );
          break;
        case 'month':
          this.filteredOrders = [...this.orders].filter((o) =>
            dayjs(o.orderDateTime).isAfter(dayjs().subtract(1, 'month'))
          );
          break;
      }
      $(event.target).addClass('selected');
    }

    this.filteredOrders.forEach((o) => {
      o.orderDishes.sort((a, b) =>
        a.cateringFacilityName.localeCompare(b.cateringFacilityName)
      );
    });
    this.filteredOrders = [...this.filteredOrders].sort(
      (a: UserOrder, b: UserOrder) =>
        new Date(b.orderDateTime).valueOf() -
        new Date(a.orderDateTime).valueOf()
    );
  }
}
