import {
  React,
  Component,
  apolloClient,
  withRouter,
  Fragment,
  cloneDeep,
  connect,
  styled,
} from "src/imports/react";
import {
  Placeholder,
  CarouselContainer,
  Carousel,
  Icon,
  ContextMenu,
  Modal,
} from "src/imports/components";
import Layout from "src/layouts/Login";
import Subheader from "src/components/WorkoutEditor/Subheader";
import WorkoutSection from "src/components/WorkoutSection";
import DatePicker from "src/components/WorkoutEditor/DatePicker";
import Header from "src/components/WorkoutEditor/Header";
import PreviousWorkouts from "src/components/WorkoutEditor/PreviousWorkouts";
import SaveButtons from "src/components/WorkoutEditor/SaveButtons";
import UnitEditor from "src/components/WorkoutEditor/UnitEditor";
import { GET_USER, GET_WORKOUT, GET_FAMILIES } from "src/imports/apollo";
import { setNotification } from "src/store/actions";

class WorkoutEditor extends Component {
  constructor(props) {
    super(props);
    this.families = null;
    this.previousWorkouts = null;
    this.state = {
      dragging: false,
      user: null,
      currentSection: 0,
      clipboard: null,
      editedUnit: null,
      editedUnitCoordinates: null,
      workoutData: null,
    };
  }

  async componentDidMount() {
    const { data: userData } = await apolloClient.query({
      query: GET_USER,
      variables: { id: this.props.location.state.userID },
    });

    const { data: familiesData } = await apolloClient.query({
      query: GET_FAMILIES,
      variables: { userId: this.props.user.id },
    });

    let workoutData = {
      selectedDate: new Date().toISOString().split("T")[0],
      selectedTime: "18:00:00",
      sticky: false,
      name: "",
      sections: [
        { name: "Rozgrzewka", complexes: [] },
        { name: "Siła", complexes: [] },
        { name: "Wytrzymałość", complexes: [] },
        { name: "Mobilność", complexes: [] },
      ],
    };

    this.previousWorkouts = [...userData.user.workouts];

    if (this.props.workoutToCopy) {
      this.previousWorkouts.unshift(this.props.workoutToCopy)
    }

    if (this.props.edit) {
      const editedWorkout = cloneDeep(
        userData.user.workouts.find(
          (workout) => workout.id === this.props.match.params.id
        )
      );

      const date = new Date(editedWorkout.scheduled);
      const hours =
        date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      const minutes =
        date.getMinutes() < 10 ? `${date.getMinutes()}0` : date.getMinutes();
      const dateTimeArray = editedWorkout.scheduled.split("T");
      workoutData.selectedDate = dateTimeArray[0];
      workoutData.selectedTime = `${hours}:${minutes}`;
      workoutData.id = editedWorkout.id;
      workoutData.sticky = editedWorkout.sticky;
      workoutData.name = editedWorkout.name;
      workoutData.sections = editedWorkout.sections;
      this.previousWorkouts = this.previousWorkouts.filter(
        (workout) => workout.id !== this.props.match.params.id
      );
    }

    this.families = familiesData.families;
    this.setState({ user: userData.user, workoutData });
  }

  changeWorkoutData = (key, event) => {
    let newValue = key === "sticky" ? event.target.checked : event.target.value;
    this.setState((state) => ({
      workoutData: { ...state.workoutData, [key]: newValue },
    }));
  };

  setEditedUnit = (unit, coordinates) => {
    this.setState({
      editedUnit: unit,
      editedUnitCoordinates: coordinates,
    });
  };

  editUnit = (unit) => {
    const {
      sectionIndex,
      complexIndex,
      unitIndex,
    } = this.state.editedUnitCoordinates;
    this.setState((state) => {
      const workoutData = cloneDeep(state.workoutData);
      workoutData.sections[sectionIndex].complexes[complexIndex].units[
        unitIndex
      ] = unit;
      return { workoutData };
    });
  };

  copyToClipboard = (type, content) => {
    const copiedContent = cloneDeep(content);
    copiedContent.feedback = "";
    this.setState({
      clipboard: {
        type,
        content: copiedContent,
      },
    });
    this.props.setNotification("Element skopiowany do schowka!");
  };

  addSection = () => {
    const newSection = {
      name: "Nowa sekcja",
      complexes: [],
    };
    const workoutData = cloneDeep(this.state.workoutData);
    workoutData.sections.push(newSection);
    this.setState((state) => ({
      workoutData,
      currentSection: workoutData.sections.length - 1,
    }));
  };

  changeSectionName = (index, event) => {
    const newName = event.target.value;
    this.setState((state) => {
      const workoutDataClone = cloneDeep(state.workoutData);
      workoutDataClone.sections[index].name = newName;
      return { workoutData: workoutDataClone };
    });
  };

  moveSection = (index, section, value) => {
    const newIndex = index + value;
    this.setState((state) => {
      const workoutData = cloneDeep(state.workoutData);
      workoutData.sections.splice(index, 1);
      workoutData.sections.splice(newIndex, 0, section);
      return {
        workoutData,
        currentSection: newIndex,
      };
    });
  };

  deleteSection = (index) => {
    this.setState((state) => {
      const workoutData = cloneDeep(state.workoutData);
      workoutData.sections.splice(index, 1);
      const newCurrentSection =
        index === workoutData.sections.length ? index - 1 : index;
      return { workoutData, currentSection: newCurrentSection };
    });
  };

  pasteIntoSection = (sectionIndex) => {
    const type = this.state.clipboard.type;
    this.setState((state) => {
      const workoutData = cloneDeep(state.workoutData);
      let dataToPaste;
      if (type === "section") {
        dataToPaste = [...state.clipboard.content.complexes];
      } else if (type === "complex") {
        dataToPaste = [state.clipboard.content];
      } else {
        dataToPaste = [{ name: "Blok", units: [state.clipboard.content] }];
      }
      workoutData.sections[sectionIndex].complexes.push(...dataToPaste);
      return { workoutData };
    });
  };

  renderSectionButtons = (sectionIndex) => {
    const sections = this.state.workoutData.sections;
    const section = sections[sectionIndex];
    const sectionButtons = [];
    if (section.complexes.length > 0) {
      sectionButtons.push({
        caption: "Kopiuj",
        icon: "pencil",
        callback: this.copyToClipboard.bind(this, "section", section),
      });
    }

    if (sectionIndex > 0) {
      sectionButtons.push({
        caption: "Przesuń w lewo",
        icon: "left-arrow-1",
        callback: this.moveSection.bind(this, sectionIndex, section, -1),
      });
    }

    if (sectionIndex < sections.length - 1) {
      sectionButtons.push({
        caption: "Przesuń w prawo",
        icon: "right-arrow-1",
        callback: this.moveSection.bind(this, sectionIndex, section, 1),
      });
    }

    if (this.state.clipboard) {
      sectionButtons.unshift({
        caption: "Wklej",
        icon: "copy",
        callback: this.pasteIntoSection.bind(this, sectionIndex),
      });
    }

    if (sections.length > 1) {
      sectionButtons.push({
        caption: "Usuń",
        icon: "trash",
        callback: this.deleteSection.bind(this, sectionIndex),
      });
    }

    return (
      <$SectionButtons>
        <button type="button" onClick={this.setEditedUnit.bind(this, {})}>
          <Icon name="plus" />
        </button>
        <ContextMenu buttons={sectionButtons} />
      </$SectionButtons>
    );
  };

  pasteIntoComplex = (sectionIndex, complexIndex) => {
    const type = this.state.clipboard.type;
    this.setState((state) => {
      const workoutData = cloneDeep(state.workoutData);
      let dataToPaste;
      if (type === "complex") {
        dataToPaste = [...state.clipboard.content.units];
      } else {
        dataToPaste = [state.clipboard.content];
      }
      workoutData.sections[sectionIndex].complexes[complexIndex].units.push(
        ...dataToPaste
      );
      return { workoutData };
    });
  };

  renderComplexButtons = (sectionIndex, complexIndex, complex) => {
    const complexButtons = [
      {
        caption: "Kopiuj",
        icon: "copy",
        callback: this.copyToClipboard.bind(this, "complex", complex),
      },
    ];

    if (this.state.clipboard && this.state.clipboard.type !== "section") {
      complexButtons.unshift({
        caption: "Wklej",
        icon: "pencil",
        callback: this.pasteIntoComplex.bind(this, sectionIndex, complexIndex),
      });
    }

    return <ContextMenu buttons={complexButtons} />;
  };

  renderUnitButtons = (sectionIndex, complexIndex, unitIndex, unit) => {
    const units = this.state.workoutData.sections[sectionIndex].complexes[
      complexIndex
    ].units;
    const unitButtons = [
      {
        caption: "Kopiuj",
        icon: "copy",
        callback: this.copyToClipboard.bind(this, "unit", unit),
      },
      {
        caption: "Edytuj",
        icon: "pencil",
        callback: this.setEditedUnit.bind(this, unit, {
          sectionIndex,
          complexIndex,
          unitIndex,
        }),
      },
    ];
    return <ContextMenu buttons={unitButtons} />;
  };

  moveUnit = (sectionIndex, value) => {
    this.setState((state) => {
      const workoutData = cloneDeep(state.workoutData);
      workoutData.sections[sectionIndex] = value;
      return { workoutData, dragging: false };
    });
  };

  renderSections = () => {
    const sections = this.state.workoutData.sections;
    const sectionNodes = sections.map((section, sectionIndex) => {
      return (
        <WorkoutSection
          section={section}
          changeName={this.changeSectionName.bind(this, sectionIndex)}
          sectionButtons={() => this.renderSectionButtons(sectionIndex)}
          complexButtons={(complex, complexIndex) =>
            this.renderComplexButtons(sectionIndex, complexIndex, complex)
          }
          unitButtons={(unit, unitIndex, complexIndex) =>
            this.renderUnitButtons(sectionIndex, complexIndex, unitIndex, unit)
          }
          key={sectionIndex}
          editable
          onDragging={() => {
            this.setState({ dragging: true });
          }}
          onDragFail={() => {
            this.setState({ dragging: false });
          }}
          onDragEnd={this.moveUnit.bind(this, sectionIndex)}
        />
      );
    });
    return (
      <Fragment>
        <Subheader>
          Sekcje
          <button type="button" onClick={this.addSection}>
            <Icon name="plus" />
          </button>
        </Subheader>
        <CarouselContainer>
          <Carousel
            inactive={this.state.dragging}
            index={this.state.currentSection}
            key={this.state.workoutData.sections.length}
          >
            {sectionNodes}
          </Carousel>
        </CarouselContainer>
      </Fragment>
    );
  };

  renderUnitEditor = () => {
    if (this.state.editedUnit) {
      return (
        <Modal>
          <UnitEditor
            unit={this.state.editedUnit}
            families={this.families}
            create={this.copyToClipboard.bind(this, "unit")}
            update={this.editUnit}
            close={this.setEditedUnit.bind(this, null)}
          />
        </Modal>
      );
    } else {
      return null;
    }
  };

  render() {
    let view = <Placeholder />;

    if (this.state.user) {
      view = (
        <Fragment>
          <Header edit={this.props.edit} username={this.state.user.fullname} />
          <DatePicker
            workoutData={this.state.workoutData}
            change={this.changeWorkoutData}
          />
          {this.renderSections()}
          {this.renderUnitEditor()}
          {this.previousWorkouts.length > 0 ? (
            <PreviousWorkouts
              workouts={this.previousWorkouts}
              copy={this.copyToClipboard}
            />
          ) : null}
          <SaveButtons
            goBack={this.props.history.goBack}
            workout={this.state.workoutData}
            userId={this.state.user.id}
          />
        </Fragment>
      );
    }
    return <$Layout>{view}</$Layout>;
  }
}

const $Layout = styled(Layout)`
  padding-bottom: 0;
`

const $SectionButtons = styled.div`
  display: flex;
`;

const mapStateToProps = (state) => {
  return {
    user: state.user,
    workoutToCopy: state.workoutToCopy,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(WorkoutEditor));
