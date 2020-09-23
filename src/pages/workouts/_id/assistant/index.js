import {
  React,
  Component,
  Fragment,
  styled,
  apolloClient,
  cloneDeep,
  colors,
  filters,
  connect,
} from "src/imports/react";
import { Video, Placeholder, Icon } from "src/imports/components";
import { GET_WORKOUT } from "src/imports/apollo";
import DefaultLayout from "src/layouts/Default";
import ExerciseLayout from "src/layouts/Exercise";
import Timer from "src/components/AssistantTimer";
import { setNotification } from "src/store/actions";

class WorkoutAssistantPage extends Component {
  constructor() {
    super();
    this.state = {
      controls: [0, 0, 0],
      timer: null,
      automaticModeOn: false,
      stopwatchModeOn: false,
      soundOn: false,
    };
  }

  async componentDidMount() {
    const { data } = await apolloClient.query({
      query: GET_WORKOUT,
      variables: {
        id: this.props.match.params.id,
      },
    });

    this.workout = this.getModifiedWorkout(data.workout);
    this.setState({ mounted: true });
  }

  getModifiedWorkout(workout) {
    const modifiedWorkout = cloneDeep(workout);
    modifiedWorkout.sections.forEach((section, sectionIndex) => {
      section.complexes.forEach((complex, complexIndex) => {
        let units = [];
        let sortedUnits = complex.units.sort((a, b) => b.sets - a.sets);
        sortedUnits.forEach((unit, index) => {
          for (let i = 0; i < unit.sets; i++) {
            units[index + i * complex.units.length] = unit;
          }
        });

        units = units.filter((unit) => unit != undefined);

        for (let i = 0; i <= units.length - 1; i++) {
          let time = units[i].rest;
          if (time > 0 && i < units.length - 1) {
            let remarks = `Następnie: ${units[i + 1].exercise.name}`;
            if (units[i + 1].remarks) {
              remarks += ` (${units[i + 1].remarks})`;
            }
            units.splice(i + 1, 0, {
              exercise: { name: "Odpocznij" },
              time,
              remarks,
            });
          }
        }

        units.unshift({
          exercise: { name: "Rozpoczynasz nowy blok" },
          remarks: "Kolejne ćwiczenie widoczne jest na ekranie",
        });

        if (
          complexIndex ===
            modifiedWorkout.sections[sectionIndex].complexes.length - 1 &&
          sectionIndex === modifiedWorkout.sections.length - 1
        ) {
          units.push({
            exercise: { name: "Ukończyłeś trening" },
            remarks: "Daj znać trenerowi, jak poszło!",
          });
        }

        modifiedWorkout.sections[sectionIndex].complexes[
          complexIndex
        ].units = units;
      });
    });

    return modifiedWorkout;
  }

  getCurrentSection = () => {
    return this.workout.sections[this.state.controls[2]];
  };

  getCurrentComplex = () => {
    return this.getCurrentSection().complexes[this.state.controls[1]];
  };

  getCurrentUnit = () => {
    return this.getCurrentComplex().units[this.state.controls[0]];
  };

  navigate = (controlIndex, newControlValue) => {
    const controls = [...this.state.controls];
    const getMaxValue = (index) => {
      const maxValues = [
        this.workout.sections[controls[2]].complexes[controls[1]].units.length -
          1,
        this.workout.sections[controls[2]].complexes.length - 1,
        this.workout.sections.length - 1,
      ];
      return maxValues[index];
    };

    if (newControlValue < 0) {
      if (controls[0] + controls[1] + controls[2] === 0) {
        return;
      }
      this.navigate(controlIndex + 1, controls[controlIndex + 1] - 1);
    } else if (newControlValue > getMaxValue(controlIndex)) {
      if (controlIndex === controls.length - 1) {
        return;
      }
      this.navigate(controlIndex + 1, controls[controlIndex + 1] + 1);
    } else {
      const oldControls = [...controls];
      controls[controlIndex] = newControlValue;
      if (newControlValue < oldControls[controlIndex]) {
        for (let i = controlIndex - 1; i >= 0; i--) {
          controls[i] = getMaxValue(i);
        }
      } else {
        for (let i = controlIndex - 1; i >= 0; i--) {
          controls[i] = 0;
        }
      }
      this.setState({ controls });
    }
  };

  updateTimer = (value) => {
    this.setState({ timer: value });
  };

  toggleSoundOn = () => {
    this.setState((state) => ({ soundOn: !state.soundOn }));
  };

  toggleAutomaticMode = () => {
    this.setState(
      (state) => ({ automaticModeOn: !state.automaticModeOn }),
      () => {
        this.props.setNotification(
          this.state.automaticModeOn
            ? "Tryb automatyczny włączony"
            : "Tryb automatyczny wyłączony"
        );
      }
    );
  };

  toggleStopwatchMode = () => {
    this.setState((state) => ({ stopwatchModeOn: !state.stopwatchModeOn }));
  };

  renderVideo = () => {
    let source,
      unit = this.getCurrentUnit();

    if (
      this.getCurrentUnit().exercise.name === "Odpocznij" ||
      this.getCurrentUnit().exercise.name === "Rozpoczynasz nowy blok"
    ) {
      unit = this.getCurrentComplex().units[this.state.controls[0] + 1];
    }

    source = unit.exercise.image
      ? unit.exercise.image.url
      : "https://res.cloudinary.com/drsgb4wld/video/upload/v1599222650/20200518_184115_001_002_xhmxyn.mp4";

    return (
      <Video
        source={source}
        key={`${this.state.controls[0]}${this.state.controls[1]}${this.state.controls[2]}`}
        opacity="0.2"
      />
    );
  };

  renderUnitDetails = () => {
    const remarks = this.getCurrentUnit().remarks || "Wykonaj teraz";
    return (
      <div>
        <$ExerciseName>{this.getCurrentUnit().exercise.name}</$ExerciseName>
        <$ExerciseRemarks>{remarks}</$ExerciseRemarks>
      </div>
    );
  };

  renderRepetitions = () => {
    let repetitions = "";
    let current = this.getCurrentUnit();
    if (current.reps) repetitions += `${current.reps}`;
    if (current.reps && current.time) repetitions += `x`;
    if (current.time) repetitions += `${current.time}s`;
    if (current.distance) repetitions = `${current.distance}m`;

    let view = <$Repetitions>{repetitions}</$Repetitions>;
    if ((current.time && !current.reps) || this.state.stopwatchModeOn) {
      view = (
        <$Repetitions>{filters.convertSecToMin(this.state.timer)}</$Repetitions>
      );
    }

    return view;
  };

  renderProgressBar = () => {
    const numberOfComplexes = this.getCurrentSection().complexes.length;

    const bars = [];
    for (
      let i = 0;
      i <
      this.getCurrentSection().complexes[this.state.controls[1]].units.length;
      i++
    ) {
      bars.push(
        <$ProgressBar
          active={i <= this.state.controls[0]}
          key={`bar-${i}`}
          onClick={this.navigate.bind(this, 0, i)}
        />
      );
    }
    return (
      <Fragment>
        <$SectionInfos>
          <$SectionInfo>{this.getCurrentSection().name} </$SectionInfo>
          <$SectionInfo>
            {`${this.getCurrentComplex().name} (${
              this.state.controls[1] + 1
            }/${numberOfComplexes})`}
          </$SectionInfo>
        </$SectionInfos>
        <$ProgressBars>{bars}</$ProgressBars>
      </Fragment>
    );
  };

  renderButtonPanel = () => {
    let buttons = [
      {
        iconName: this.state.soundOn ? "sound" : "mute",
        active: false,
        cb: this.toggleSoundOn,
      },
      {
        iconName: "login",
        active: this.state.automaticModeOn,
        cb: this.toggleAutomaticMode,
      },
      {
        iconName: "counterclockwise",
        active: this.state.stopwatchModeOn,
        cb: this.toggleStopwatchMode,
      },
    ];

    const buttonNodes = buttons.map((button, index) => {
      return (
        <$Button active={button.active} onClick={button.cb} key={index}>
          <Icon name={button.iconName}></Icon>
        </$Button>
      );
    });
    return (
      <$ButtonPanel>
        <$Buttons>{buttonNodes}</$Buttons>
        <Timer
          active={this.getCurrentUnit().time > 0 && !this.getCurrentUnit().reps}
          automatic={this.state.automaticModeOn}
          stopwatchMode={this.state.stopwatchModeOn}
          soundOn={this.state.soundOn}
          time={this.getCurrentUnit().time}
          key={this.state.controls[0]}
          updateTime={this.updateTimer}
          countdownOver={this.navigate.bind(
            this,
            0,
            this.state.controls[0] + 1
          )}
        />
      </$ButtonPanel>
    );
  };

  render() {
    let view = (
      <DefaultLayout>
        <Placeholder />
      </DefaultLayout>
    );

    if (this.state.mounted) {
      view = (
        <ExerciseLayout>
          {this.renderVideo()}
          <$Assistant>
            <$Controls>
              <$Control
                type="button"
                onClick={this.navigate.bind(
                  this,
                  0,
                  this.state.controls[0] - 1
                )}
              />
              <$Control
                type="button"
                onClick={this.navigate.bind(
                  this,
                  0,
                  this.state.controls[0] + 1
                )}
              />
            </$Controls>
            <$UnitData>
              {this.renderUnitDetails()}
              {this.renderRepetitions()}
            </$UnitData>
            <$Panel>
              {this.renderProgressBar()}
              {this.renderButtonPanel()}
            </$Panel>
          </$Assistant>
        </ExerciseLayout>
      );
    }

    return view;
  }
}

const $Assistant = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  z-index: 1;
  height: 100vh;
`;

const $Controls = styled.div`
  height: 100%;
`;

const $Control = styled.button`
  height: 100%;
  width: 50%;
`;

const $ExerciseName = styled.h3`
  margin-bottom: 0;
`;

const $ExerciseRemarks = styled.p`
  font-size: 12px;
  margin: 0;
`;

const $UnitData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0 1rem;
`;

const $Repetitions = styled.p`
  padding-left: 1rem;
  line-height: 1;
  font-size: 32px;
  margin: 0;
  color: ${colors.headers};
`;

const $Panel = styled.div`
  padding: 1rem;
`;

const $SectionInfos = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 12px;
`;

const $SectionInfo = styled.p`
  font-size: 12px;
  margin-bottom: 2px;
`;

const $ProgressBars = styled.div`
  display: flex;
  margin-bottom: 1rem;
`;

const $ProgressBar = styled.span`
  height: 2px;
  margin-right: 1px;
  background-color: ${(props) => (props.active ? "white" : colors.faded)};
  flex: 1;
`;

const $ButtonPanel = styled.div`
  display: flex;
  justify-content: space-between;
`;

const $Buttons = styled.div`
  display: flex;
  align-items: center;
`;

const $Button = styled.button`
  margin-right: .75rem;
  font-size: 16px;
  color: ${(props) => (props.active ? colors.headers : "white")};
`;

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(null, mapDispatchToProps)(WorkoutAssistantPage);
