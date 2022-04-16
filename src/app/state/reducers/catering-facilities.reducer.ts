import { CateringFacilitiesState } from 'src/app/models/state/cateringFacilitiesState';
import { ActionTypes, PayloadAction } from '../actions/app.actions';

const initialState: CateringFacilitiesState = {
  allCateringFacilities: [],
};

export function cateringFacilitiesStateReducer(
  state: CateringFacilitiesState = initialState,
  action: PayloadAction
) {
  switch (action.type) {
    case ActionTypes.SET_CATERING_FACILITIES:
      return action.payload ? action.payload : initialState;
    default:
      return state;
  }
}
