import * as actionTypes from "src/store/actionTypes";

const initialState = {
  interval: null,
  currentTime: 0,
};

const stopwatchReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.MANAGE_STOPWATCH:
      if (action.payload.action === "run") {
        return {
          currentTime: state.currentTime + 1,
          interval: action.payload.interval,
        };
      } else if (action.payload.action === "stop") {
        return { ...state, interval: null };
      } else if (action.payload.action === "reset") {
        return {
          ...state,
          currentTime: 0,
        };
      }
    default:
      return state;
  }
};

export default stopwatchReducer;
