import * as actionTypes from "src/store/actions"
import Cookies from "js-cookie"

const initialState = {
  user: Cookies.get("user"), 
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      Cookies.set("user", action.user)
      return {
        ...state, 
        user: action.user,
      }
    case actionTypes.UNSET_USER:
      Cookies.set("user", null)
      return {
        ...state, 
        user: null,
      }
    default: 
      return state
  }
}

export default reducer