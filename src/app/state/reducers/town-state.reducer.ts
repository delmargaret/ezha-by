import { TownState } from 'src/app/models/state/townState';
import { Towns } from 'src/app/models/towns';
import { ActionTypes, PayloadAction } from '../actions/app.actions';

const initialState: TownState = {
  town: Towns.Minsk,
};

export function townStateReducer(
  state: TownState = initialState,
  action: PayloadAction
) {
  switch (action.type) {
    case ActionTypes.SET_CURRENT_TOWN: {
      const state: TownState = action.payload ? action.payload : initialState;
      localStorage.setItem('town', JSON.stringify(state.town));
      return state;
    }
    default:
      return state;
  }
}
