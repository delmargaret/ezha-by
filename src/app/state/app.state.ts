import { CateringFacilitiesState } from '../models/state/cateringFacilitiesState';
import { LoginState } from '../models/state/loginState';
import { OrderState } from '../models/state/orderState';
import { TownState } from '../models/state/townState';

export interface AppState {
  loginState: LoginState;
  cateringFacilitiesState: CateringFacilitiesState;
  orderState: OrderState;
  townState: TownState;
}
