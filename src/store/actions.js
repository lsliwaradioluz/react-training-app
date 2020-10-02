import * as actionTypes from "src/store/actionTypes";
import { Store, set, get } from "idb-keyval";

const db = new Store("piti-baza", "workouts");

export const setUser = (user, token) => {
  return {
    type: actionTypes.SET_USER,
    user,
    token,
  };
};

export const unsetUser = () => {
  return { type: actionTypes.UNSET_USER };
};

export const setContextMenu = (contextMenuID) => {
  return { type: actionTypes.SET_CONTEXT_MENU, contextMenuID };
};

export const setNotification = (notification) => {
  return { type: actionTypes.SET_NOTIFICATION, notification };
};

export const setLoading = (loading) => {
  return { type: actionTypes.SET_LOADING, loading };
};

export const addEntryToDB = (key, entry) => {
  return async (dispatch) => {
    set(key, entry, db);
    dispatch({ type: actionTypes.ADD_ENTRY_TO_DB, payload: { key, entry } });
  };
};

export const fetchFromDB = () => {
  return async (dispatch) => {
    const workoutToPair = await get("workoutToPair", db);
    const workoutToCopy = await get("workoutToCopy", db);
    dispatch({
      type: actionTypes.FETCH_FROM_DB,
      workouts: { workoutToCopy, workoutToPair },
    });
  };
};
