import * as actionTypes from "src/store/actionTypes";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  activeContextMenu: null,
  notification: null,
  loading: false,
  workoutToPair: null,
  workoutToCopy: null,
  storeHydrated: false, 
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      Cookies.set("user", action.user);
      if (action.token) {
        Cookies.set("piti-token", action.token);
      }
      return {
        ...state,
        user: action.user,
      };
    case actionTypes.UNSET_USER:
      Cookies.set("user", null);
      Cookies.set("piti-token", null);
      return {
        ...state,
        user: null,
      };
    case actionTypes.SET_CONTEXT_MENU:
      return {
        ...state,
        activeContextMenu: action.contextMenuID,
      };
    case actionTypes.SET_NOTIFICATION:
      return {
        ...state,
        notification: action.notification,
      };
    case actionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
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
};

export default reducer;
