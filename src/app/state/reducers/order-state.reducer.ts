import { OrderState } from 'src/app/models/state/orderState';
import { ActionTypes, PayloadAction } from '../actions/app.actions';

const initialState: OrderState = {
  orderDishes: [],
};

export function orderStateReducer(
  state: OrderState = initialState,
  action: PayloadAction
) {
  switch (action.type) {
    case ActionTypes.SET_ORDER_DISHES: {
      const state: OrderState = action.payload ? action.payload : initialState;
      localStorage.setItem('order', JSON.stringify(state.orderDishes));
      return state;
    }
    default:
      return state;
  }
}
