import * as actionTypes from "src/store/actionTypes";

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
