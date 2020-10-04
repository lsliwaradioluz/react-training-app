import "src/assets/styles/App.css";
import "src/assets/icons/font/flaticon.css";
import "src/assets/styles/icons.css";
import {
  React,
  Component,
  Switch,
  Route,
  Redirect,
  Fragment,
} from "src/imports/react";
import { connect } from "react-redux";
import { fetchFromDB, setUser } from "src/store/actions";
import Cookies from "js-cookie";

import Notification from "src/components/Notification";
import Confirm from "src/components/Confirm";
import Loading from "src/components/Loading";

import RegisterPage from "src/pages/register/index";
import LoginPage from "src/pages/login/index";
import DashboardPage from "src/pages/dashboard/index";
import ExercisesPage from "src/pages/exercises/index";
import CardioPage from "src/pages/cardio//index";
import ExercisePage from "src/pages/exercises/_id/index";
import NewFamilyPage from "src/pages/exercises/new-family/index";
import NewExercisePage from "src/pages/exercises/_id/new-exercise/index";
import EditExercisePage from "src/pages/exercises/_id/edit-exercise/index";
import EditFamilyPage from "src/pages/exercises/_id/edit-family";
import WorkoutsPage from "src/pages/workouts/index";
import WorkoutPage from "src/pages/workouts/_id/index";
import UsersPage from "src/pages/users/index";
import UserPage from "src/pages/users/_id/index";
import SettingsPage from "src/pages/settings/index";
import ChangePasswordPage from "src/pages/settings/change-password/index";
import WorkoutAssistantPage from "src/pages/workouts/_id/assistant/index";
import NewWorkoutPage from "./pages/workouts/new/index";
import EditWorkoutPage from "./pages/workouts/_id/edit/index";
import DefaultLayout from "./layouts/Default";
import { Placeholder } from "./imports/components";

class App extends Component {
  componentDidMount() {
    this.hydrateStore();
  }

  hydrateStore() {
    console.log('dupa')
    let user = Cookies.get("user");
    if (user !== undefined) {
      this.props.setUser(user && JSON.parse(user));
    }
    this.props.fetchDataFromDB();
  }

  render() {
    let app = (
      <DefaultLayout>
        <Placeholder />
      </DefaultLayout>
    );
    if (this.props.storeHydrated) {
      app = (
        <div className="App">
          <Switch>
            <Route exact path="/register" component={RegisterPage} />
            <Route exact path="/login" component={LoginPage} />
            <Redirect exact from="/" to="/login" />
            {this.props.user ? (
              <Fragment>
                <Route exact path="/dashboard" component={DashboardPage} />
                <Switch>
                  <Route
                    exact
                    path="/exercises/new-family"
                    component={NewFamilyPage}
                  />
                  <Route exact path="/exercises/:id" component={ExercisePage} />
                  <Route
                    exact
                    path="/exercises/:id/edit-family"
                    component={EditFamilyPage}
                  />
                  <Route
                    exact
                    path="/exercises/:id/new-exercise"
                    component={NewExercisePage}
                  />
                  <Route
                    exact
                    path="/exercises/:id/edit-exercise"
                    component={EditExercisePage}
                  />
                </Switch>
                <Route exact path="/exercises" component={ExercisesPage} />
                <Route exact path="/cardio" component={CardioPage} />
                <Route exact path="/workouts" component={WorkoutsPage} />
                <Switch>
                  <Route exact path="/workouts/new" component={NewWorkoutPage} />
                  <Route exact path="/workouts/:id" component={WorkoutPage} />
                </Switch>
                <Route
                  exact
                  path="/workouts/:id/edit"
                  component={EditWorkoutPage}
                />
                <Route
                  exact
                  path="/workouts/:id/assistant"
                  component={WorkoutAssistantPage}
                />
                <Route exact path="/users" component={UsersPage} />
                <Route exact path="/users/:id" component={UserPage} />
                <Route exact path="/settings" component={SettingsPage} />
                <Route
                  exact
                  path="/settings/change-password"
                  component={ChangePasswordPage}
                />
              </Fragment>
            ) : null}
          </Switch>
          <Notification />
          <Confirm />
          <Loading />
        </div>
      );
    }
    return app;
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    storeHydrated: state.storeHydrated,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchDataFromDB: () => dispatch(fetchFromDB()),
    setUser: (user) => dispatch(setUser(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
