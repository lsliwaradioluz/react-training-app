import * as actionTypes from "src/store/actionTypes/workouts";
import { Store, set, get } from "idb-keyval";

const db = new Store("piti-baza", "workouts");

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
