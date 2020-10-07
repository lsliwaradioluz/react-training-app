import * as actionTypes from "src/store/actionTypes/assistant";

const initialState = {
  workoutID: null,
  controls: [0, 0, 0],
  timer: {
    interval: null,
    time: null,
  },
  automaticModeOn: false,
  stopwatchModeOn: false,
  soundOn: false,
};

const assistantReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.RESET_STATE:
      clearInterval(state.timer.interval);
      return {
        ...initialState,
        automaticModeOn: state.automaticModeOn,
        soundOn: state.soundOn,
        workoutID: action.workoutID,
      };
    case actionTypes.SET_CONTROLS:
      return {
        ...state,
        controls: action.controls,
      };
    case actionTypes.TOGGLE_SOUNDON:
      return {
        ...state,
        soundOn: !state.soundOn,
      };
    case actionTypes.TOGGLE_STOPWATCH_MODE:
      return {
        ...state,
        stopwatchModeOn: !state.stopwatchModeOn,
      };
    case actionTypes.TOGGLE_AUTOMATIC_MODE:
      return {
        ...state,
        automaticModeOn: !state.automaticModeOn,
      };
    case actionTypes.SET_TIMER:
      clearInterval(state.timer.interval);
      return {
        ...state,
        timer: {
          interval: null,
          time: action.time,
        },
      };
    case actionTypes.START_TIMER:
      return {
        ...state,
        timer: {
          ...state.timer,
          interval: action.interval,
        },
      };
    case actionTypes.PAUSE_TIMER:
      clearInterval(state.timer.interval);
      return {
        ...state,
        timer: {
          ...state.timer,
          interval: null,
        },
      };
    case actionTypes.INCREMENT_TIME:
      return {
        ...state,
        timer: {
          ...state.timer,
          time: state.timer.time + 1,
        },
      };
    case actionTypes.DECREMENT_TIME:
      if (state.timer.time === 0) {
        clearInterval(state.timer.interval);
        return {
          ...state, 
          timer: {
            time: state.timer.time, 
            interval: null,
          }
        }
      } else {
        return {
          ...state,
          timer: {
            time: state.timer.time - 1,
            interval: state.timer.interval,
          },
        };
      }
      
    default:
      return state;
  }
};

export default assistantReducer;
