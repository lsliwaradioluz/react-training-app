import * as actionTypes from "src/store/actionTypes";

const initialState = {
  workoutToPair: null,
  workoutToCopy: null,
  storeHydrated: false,
};

const workoutsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_ENTRY_TO_DB:
      return {
        ...state,
        [action.payload.key]: action.payload.entry,
      };
    case actionTypes.FETCH_FROM_DB:
      return {
        ...state,
        ...action.workouts,
        storeHydrated: true,
      };
    default:
      return state;
  }
}

export default workoutsReducer