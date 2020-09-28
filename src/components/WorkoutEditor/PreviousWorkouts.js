import { React, Component, styled, filters, Fragment } from "src/imports/react";
import {
  Carousel,
  CarouselContainer,
  ContextMenu,
  Icon,
} from "src/imports/components";
import Subheader from "src/components/WorkoutEditor/Subheader";
import WorkoutSection from "src/components/WorkoutSection";

class PreviousWorkouts extends Component {
  state = {
    current: 0,
  };

  setCurrent = (value) => {
    this.setState((state) => {
      const newValue = state.current + value;
      if (newValue < 0 || newValue > this.props.workouts.length - 1) {
        return {};
      }
      return {
        current: newValue,
      };
    });
  };

  render = () => {
    const previousWorkout = this.props.workouts[this.state.current];

    const previousWorkoutSections = previousWorkout.sections.map((section) => (
      <WorkoutSection
        section={section}
        key={section.id}
        sectionButtons={() => (
          <button
            type="button"
            onClick={this.props.copy.bind(this, "section", section)}
          >
            <Icon name="plus" />
          </button>
        )}
        complexButtons={(complex) => (
          <button
            type="button"
            onClick={this.props.copy.bind(this, "section", complex)}
          >
            <Icon name="plus" />
          </button>
        )}
        unitButtons={(unit) => (
          <button
            type="button"
            onClick={this.props.copy.bind(this, "unit", unit)}
          >
            <Icon name="plus" />
          </button>
        )}
      />
    ));

    const previousWorkoutDate = `${filters.getDayName(
      previousWorkout.scheduled
    )} ${filters.getDayAndMonth(previousWorkout.scheduled)}`;

    return (
      <Fragment>
        <Subheader>
          {previousWorkoutDate}
          <$PreviousWorkoutsNav>
            <$PreviousWorkoutsButton
              type="button"
              active={this.state.current > 0}
              onClick={this.setCurrent.bind(this, -1)}
            >
              <Icon name="left-arrow" />
            </$PreviousWorkoutsButton>
            <$PreviousWorkoutsButton
              type="button"
              active={this.state.current < this.props.workouts.length - 1}
              onClick={this.setCurrent.bind(this, +1)}
            >
              <Icon name="right-arrow" />
            </$PreviousWorkoutsButton>
          </$PreviousWorkoutsNav>
        </Subheader>
        <CarouselContainer>
          <Carousel>{previousWorkoutSections}</Carousel>
        </CarouselContainer>
      </Fragment>
    );
  };
}

const $PreviousWorkoutsNav = styled.div``;

const $PreviousWorkoutsButton = styled.button`
  opacity: ${(props) => (props.active ? 1 : 0.3)};
`;

export default PreviousWorkouts;
