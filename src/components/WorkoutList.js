import { React, Component, styled, Fragment } from "src/imports/react";
import WorkoutTab from "src/components/WorkoutTab";
import { Button } from "src/imports/components";

class WorkoutList extends Component {
  state = {
    showHomeworks: false,
  };

  toggleShowHomeworks = (value) => {
    this.setState({ showHomeworks: value });
  };

  renderWorkouts() {
    const filteredWorkouts = this.props.user.workouts.filter(
      (workout) => workout.sticky === this.state.showHomeworks
    );

    let view = (
      <Fragment>
        {filteredWorkouts.map((workout) => (
          <WorkoutTab
            workout={workout}
            user={this.props.user}
            key={workout.id}
            onWorkoutDelete={this.props.onWorkoutDelete}
          />
        ))}
      </Fragment>
    );

    if (filteredWorkouts.length === 0) {
      view = <p>Brak treningów do wyświetlenia</p>;
    }

    return view;
  }

  render() {
    return (
      <Fragment>
        <$Buttons>
          <Button
            theme="switch"
            active={!this.state.showHomeworks}
            click={this.toggleShowHomeworks.bind(this, false)}
          >
            Jednorazowe
          </Button>
          <Button
            theme="switch"
            active={this.state.showHomeworks}
            click={this.toggleShowHomeworks.bind(this, true)}
          >
            Wielorazowe
          </Button>
        </$Buttons>
        {this.renderWorkouts()}
      </Fragment>
    );
  }
}

const $Buttons = styled.div`
  display: flex;
`;

export default WorkoutList;
