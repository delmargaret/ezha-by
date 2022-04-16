import { loginStateReducer } from '../reducers/login-state.reducer';
import { cateringFacilitiesStateReducer } from '../reducers/catering-facilities.reducer';
import { orderStateReducer } from '../reducers/order-state.reducer';
import { townStateReducer } from './town-state.reducer';

export const mainReducer = {
  loginState: loginStateReducer,
  cateringFacilitiesState: cateringFacilitiesStateReducer,
  orderState: orderStateReducer,
  townStatw: townStateReducer,
};
