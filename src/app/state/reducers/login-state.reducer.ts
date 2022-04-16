import { LoginState } from 'src/app/models/state/loginState';
import { ActionTypes, PayloadAction } from '../actions/app.actions';

const initialState: LoginState = {
  isLoggedIn: false,
};

export function loginStateReducer(
  state: LoginState = initialState,
  action: PayloadAction
) {
  switch (action.type) {
    case ActionTypes.SET_LOGIN_STATE:
      return action.payload ? action.payload : initialState;
    default:
      return state;
  }
}
