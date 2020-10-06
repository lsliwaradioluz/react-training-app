import * as actionTypes from "src/store/actionTypes";

const initialState = {
  workoutID: null,
  controls: null,
  timer: null,
  automaticModeOn: false,
  stopwatchModeOn: false,
  soundOn: false,
};

const assistantReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MANAGE_ASSISTANT:
      return action.assistantState;
    default:
      return state;
  }
};

export default assistantReducer;
