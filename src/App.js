import React from 'react'
import 'src/assets/styles/App.css'
import 'src/assets/icons/font/flaticon.css'
import 'src/assets/styles/icons.css'
import { Switch, Route, Redirect, Fragment } from "src/imports/react"
import { connect } from "react-redux"

import Notification from "src/components/Notification"
import Confirm from "src/components/Confirm"

import RegisterPage from "src/pages/register/index"
import LoginPage from "src/pages/login/index"
import DashboardPage from "src/pages/dashboard/index"
import ExercisesPage from "src/pages/exercises/index"
import ExercisePage from "src/pages/exercises/_id/index";
import NewFamilyPage from "src/pages/exercises/new-family/index"
import NewExercisePage from "src/pages/exercises/_id/new-exercise/index"
import EditExercisePage from "src/pages/exercises/_id/edit-exercise/index"
import EditFamilyPage from "src/pages/exercises/_id/edit-family"
import WorkoutsPage from "src/pages/workouts/index"
import UsersPage from "src/pages/users/index"
import SettingsPage from "src/pages/settings/index"

const App = (props) => {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/register" component={RegisterPage} />
        <Route exact path="/login" component={LoginPage} />
        { 
          props.user ? 
          <Fragment>
            <Route exact path="/dashboard" component={DashboardPage} />
            <Switch>
              <Route exact path="/exercises/new-family" component={NewFamilyPage} />
              <Route exact path="/exercises/:id" component={ExercisePage} />
              <Route exact path="/exercises/:id/edit-family" component={EditFamilyPage} /> 
              <Route exact path="/exercises/:id/new-exercise" component={NewExercisePage} />
              <Route exact path="/exercises/:id/edit-exercise" component={EditExercisePage} />          
            </Switch>
            <Route exact path="/exercises" component={ExercisesPage} />
            <Route exact path="/workouts" component={WorkoutsPage} />
            <Route exact path="/users" component={UsersPage} />
            <Route exact path="/settings" component={SettingsPage} />
          </Fragment> :
          null
        }
        <Redirect from="/" to="/login" />
      </Switch>
      <Notification />
      <Confirm />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(App);
