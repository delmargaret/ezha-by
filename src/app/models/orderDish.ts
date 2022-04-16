import { Dish } from './dish';

export interface OrderDish {
  dish: Dish;
  numberOfDishes: number;
  cateringFacilityId: string;
}
