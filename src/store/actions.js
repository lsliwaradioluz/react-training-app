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

export const setContextMenu = (contextMenuID) => {
  return { type: actionTypes.SET_CONTEXT_MENU, contextMenuID };
}

export const setNotification = (notification) => {
  return { type: actionTypes.SET_NOTIFICATION, notification }
}
