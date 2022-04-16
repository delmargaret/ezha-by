import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CourierStatuses } from '../models/courierStatuses';
import { Order } from '../models/order';
import { UserOrder } from '../models/userOrder';
import { ConfigService } from './config.service';

@Injectable()
export class OrdersService {
  constructor(private http: HttpClient) {}

  AddOrder(order: Order): Observable<Object> {
    return this.http.post(ConfigService.addBaseAddress(`api/orders`), order);
  }

  GetUserOrders(): Observable<UserOrder[]> {
    return this.http.get<UserOrder[]>(
      ConfigService.addBaseAddress('api/orders')
    );
  }

  GetCafeOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(
      ConfigService.addBaseAddress('api/orders/cafe-orders')
    );
  }

  GetCourierOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(
      ConfigService.addBaseAddress('api/orders/courier-orders')
    );
  }

  SetOrderStatus(id: string, status: number): Observable<Object> {
    const data = {
      orderStatus: status,
    };
    return this.http.put(
      ConfigService.addBaseAddress(`api/orders/${id}/status`),
      data
    );
  }

  SetOrderCourier(id: string): Observable<Object> {
    return this.http.put(
      ConfigService.addBaseAddress(`api/orders/${id}/courier`),
      {}
    );
  }

  AcceptOrder(id: string): Observable<Object> {
    return this.http.put(
      ConfigService.addBaseAddress(`api/orders/${id}/accept`),
      {}
    );
  }

  RejectOrder(id: string): Observable<Object> {
    return this.http.put(
      ConfigService.addBaseAddress(`api/orders/${id}/reject`),
      {}
    );
  }

  GetCourierStatus(): Observable<CourierStatuses> {
    return this.http.get<CourierStatuses>(
      ConfigService.addBaseAddress(`api/orders/courier-status`),
      {}
    );
  }

  SetCourierStatus(status: number): Observable<Object> {
    const data = {
      courierStatus: status,
    };
    return this.http.put(
      ConfigService.addBaseAddress(`api/orders/courier-status`),
      data
    );
  }
}
