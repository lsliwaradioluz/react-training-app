import * as actionTypes from "src/store/actionTypes/stopwatch";

export const manageStopwatch = (action, interval) => {
  return { type: actionTypes.MANAGE_STOPWATCH, payload: { action, interval } };
};