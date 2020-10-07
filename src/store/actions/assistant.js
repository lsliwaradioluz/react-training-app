import * as actionTypes from "src/store/actionTypes/assistant";

export const setControls = (controls) => {
  return { type: actionTypes.SET_CONTROLS, controls };
};

export const resetState = (workoutID) => {
  return { type: actionTypes.RESET_STATE, workoutID };
};

export const toggleSoundOn = () => {
  return { type: actionTypes.TOGGLE_SOUNDON };
};

export const toggleStopwatchMode = () => {
  return { type: actionTypes.TOGGLE_STOPWATCH_MODE };
};

export const toggleAutomaticMode = () => {
  return { type: actionTypes.TOGGLE_AUTOMATIC_MODE };
};

export const startTimer = (interval) => {
  return { type: actionTypes.START_TIMER, interval };
};

export const setTimer = (time) => {
  return { type: actionTypes.SET_TIMER, time };
};

export const incrementTime = () => {
  return { type: actionTypes.INCREMENT_TIME };
};

export const decrementTime = () => {
  return { type: actionTypes.DECREMENT_TIME };
};

export const pauseTimer = () => {
  return { type: actionTypes.PAUSE_TIMER };
};
