import * as actionTypes from "src/store/actionTypes"
import Cookies from "js-cookie"

const initialState = {
  user: JSON.parse(Cookies.get("user")), 
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      Cookies.set("user", action.user)
      Cookies.set("piti-token", action.token)
      return {
        ...state, 
        user: action.user,
      }
    case actionTypes.UNSET_USER:
      Cookies.set("user", null)
      Cookies.set("piti-token", null)
      return {
        ...state, 
        user: null,
      }
    default: 
      return state
  }
}

export default reducer