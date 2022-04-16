import { OrderLine } from './orderLine';
import { PaymentTypes } from './paymentTypes';
import { Towns } from './towns';

export interface Order {
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  town: Towns;
  street: string;
  houseNumber: string;
  flatNumber: string;
  paymentType: PaymentTypes;
  comment: string;
  totalPrice: number;
  userId: string | null;
  orderDishes: OrderLine[];
}
