import * as actionTypes from "src/store/actionTypes/stopwatch";

const initialState = {
  interval: null,
  currentTime: 0,
};

const stopwatchReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RUN_STOPWATCH:
      return {
        currentTime: state.currentTime + 1,
        interval: action.interval,
      };
    case actionTypes.STOP_STOPWATCH:
      return { ...state, interval: null };
    case actionTypes.RESET_STOPWATCH:
      return {
        ...state,
        currentTime: 0,
      };
    default:
      return state;
  }
};

export default stopwatchReducer;
