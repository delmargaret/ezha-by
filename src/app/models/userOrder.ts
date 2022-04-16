interface UserOrderDish {
  id: string;
  dishName: string;
  dishIconUrl: string;
  description: string;
  price: number;
  numberOfDishes: number;
  cateringFacilityName: string;
}

export interface UserOrder {
  id: string;
  name: string;
  surname: string;
  patronymic: string;
  phone: string;
  town: number;
  street: string;
  houseNumber: string;
  flatNumber: string;
  paymentType: number;
  comment: string;
  orderStatus: number;
  orderDateTime: string;
  isOrderAccepted: boolean;
  totalPrice: number;
  orderDishes: UserOrderDish[];
}
