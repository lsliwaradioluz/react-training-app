import React from 'react'
import 'src/assets/styles/App.css'
import 'src/assets/icons/font/flaticon.css'
import 'src/assets/styles/icons.css'
import { Switch, Route, Redirect, Fragment } from "src/imports/react"
import { connect } from "react-redux"

import Register from "src/pages/Register"
import Login from "src/pages/Login"
import Dashboard from "src/pages/Dashboard"
import Exercises from "src/pages/Exercises"
import Workouts from "src/pages/Workouts"
import Users from "src/pages/Users"
import Settings from "src/pages/Settings"

const App = (props) => {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        { 
          props.user ? 
          <Fragment>
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/exercises" component={Exercises} />
            <Route exact path="/workouts" component={Workouts} />
            <Route exact path="/users" component={Users} />
            <Route exact path="/settings" component={Settings} />
          </Fragment> :
          null
        }
        <Redirect from="/" to="/login" />
      </Switch>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(App);
