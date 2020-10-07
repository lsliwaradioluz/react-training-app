import * as actionTypes from "src/store/actionTypes/stopwatch";

export const runStopwatch = (interval) => {
  return { type: actionTypes.RUN_STOPWATCH, interval };
};

export const stopStopwatch = () => {
  return { type: actionTypes.STOP_STOPWATCH };
};

export const resetStopwatch = () => {
  return { type: actionTypes.RESET_STOPWATCH };
};
