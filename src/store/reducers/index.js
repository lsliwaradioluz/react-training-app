import { combineReducers } from 'redux'
import assistant from './assistant'
import main from './main'
import stopwatch from './stopwatch'
import workouts from './workouts'

export default combineReducers({
  assistant,
  main, 
  stopwatch, 
  workouts,
})