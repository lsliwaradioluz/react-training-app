import {
  React,
  Component,
  Fragment,
  styled,
  apolloClient,
  cloneDeep,
  colors,
} from "src/imports/react";
import { Video, Placeholder } from "src/imports/components";
import { GET_WORKOUT } from "src/imports/apollo";
import DefaultLayout from "src/layouts/Default";
import ExerciseLayout from "src/layouts/Exercise";

class WorkoutAssistantPage extends Component {
  constructor() {
    super();
    this.state = {
      controls: [0, 0, 0],
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
        let units = []
        let sortedUnits = complex.units.sort((a, b) => b.sets - a.sets)
        sortedUnits.forEach((unit, index) => {
          for (let i = 0; i < unit.sets; i++) {
            units[index + i * complex.units.length] = unit
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
    return this.workout.sections[this.state.controls[2]]
  }

  getCurrentComplex = () => {
    return this.getCurrentSection().complexes[this.state.controls[1]]
  }

  getCurrentUnit = () => {
    return this.getCurrentComplex().units[this.state.controls[0]]
  }

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

  renderVideo = () => {
    let 
      source,
      nextUnit = this.getCurrentComplex().units[this.state.controls[0] + 1];

    if (
      this.getCurrentUnit().exercise.name == "Odpocznij" ||
      this.getCurrentUnit().exercise.name == "Rozpoczynasz nowy blok"
    ) {
      source = nextUnit.exercise.image
        ? nextUnit.exercise.image.url
        : "https://res.cloudinary.com/drsgb4wld/video/upload/v1599222650/20200518_184115_001_002_xhmxyn.mp4";
    } else {
      source = this.getCurrentUnit().exercise.image
        ? this.getCurrentUnit().exercise.image.url
        : "https://res.cloudinary.com/drsgb4wld/video/upload/v1599222650/20200518_184115_001_002_xhmxyn.mp4";
    }

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
      <Fragment>
        <h3>{this.getCurrentUnit().exercise.name}</h3>
        <p>{remarks}</p>
      </Fragment>
    );
  };

  renderProgressBar = () => {
    const numberOfComplexes = this.getCurrentSection().complexes.length;

    const bars = [];
    for (
      let i = 0;
      i < this.getCurrentSection().complexes[this.state.controls[1]].units.length;
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
        <$SectionInfo>
          {this.getCurrentSection().name}{" "}
          {`${this.state.controls[1] + 1}/${numberOfComplexes}`}
        </$SectionInfo>
        <$ProgressBars>{bars}</$ProgressBars>
      </Fragment>
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
            <$Panel>
              {this.renderUnitDetails()}
              {this.renderProgressBar()}
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

const $Panel = styled.div`
  padding: 1rem;
  h3 {
    margin-bottom: 0;
  }
  p {
    font-size: 12px;
  }
`;

const $SectionInfo = styled.p`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
`;

const $ProgressBars = styled.div`
  display: flex;
`;

const $ProgressBar = styled.span`
  height: 2px;
  margin-right: 1px;
  background-color: ${(props) => (props.active ? "white" : colors.faded)};
  flex: 1;
`;

export default WorkoutAssistantPage;
