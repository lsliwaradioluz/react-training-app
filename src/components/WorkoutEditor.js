import {
  React,
  Component,
  apolloClient,
  withRouter,
  Fragment,
  cloneDeep,
  connect,
} from "src/imports/react";
import {
  Placeholder,
  CarouselContainer,
  Carousel,
  Icon,
  ContextMenu,
} from "src/imports/components";
import Layout from "src/layouts/Login";
import Subheader from "src/components/WorkoutEditor/Subheader";
import WorkoutSection from "src/components/WorkoutSection";
import DatePicker from "src/components/WorkoutEditor/DatePicker";
import Header from "src/components/WorkoutEditor/Header";
import PreviousWorkouts from "src/components/WorkoutEditor/PreviousWorkouts";
import Buttons from "src/components/WorkoutEditor/Buttons";
import { GET_USER } from "src/imports/apollo";
import { setNotification } from "src/store/actions";

class WorkoutEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      currentSection: 0,
      workoutData: {
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
      },
    };
    this.clipboard = null;
  }

  async componentDidMount() {
    const { data } = await apolloClient.query({
      query: GET_USER,
      variables: { id: this.props.match.params.id },
    });

    this.setState({ user: data.user });
  }

  changeWorkoutData = (key, event) => {
    let newValue = key === "sticky" ? event.target.checked : event.target.value;
    this.setState((state) => ({
      workoutData: { ...state.workoutData, [key]: newValue },
    }));
  };

  copyToClipboard = (type, content) => {
    const copiedContent = cloneDeep(content);
    this.clipboard = {
      type,
      content: copiedContent,
    };
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

  renderSections = () => {
    const sections = this.state.workoutData.sections;
    const sectionNodes = sections.map((section, index) => {
      const sectionButtons = [];
      if (sections.length > 1) {
        sectionButtons.push({
          caption: "Usuń",
          icon: "trash",
          callback: this.deleteSection.bind(this, index),
        });
      }
      if (index > 0) {
        sectionButtons.push({
          caption: "Przesuń w lewo",
          icon: "left-arrow-1",
          callback: this.moveSection.bind(this, index, section, -1),
        });
      }

      if (index < sections.length - 1) {
        sectionButtons.push({
          caption: "Przesuń w prawo",
          icon: "right-arrow-1",
          callback: this.moveSection.bind(this, index, section, 1),
        });
      }

      return (
        <WorkoutSection
          section={section}
          changeName={this.changeSectionName.bind(this, index)}
          sectionButtons={() => <ContextMenu buttons={sectionButtons} />}
          key={index}
          editable
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
            index={this.state.currentSection}
            key={this.state.workoutData.sections.length}
          >
            {sectionNodes}
          </Carousel>
        </CarouselContainer>
      </Fragment>
    );
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
          <PreviousWorkouts
            workouts={this.state.user.workouts}
            copy={this.copyToClipboard}
          />
          <Buttons goBack={this.props.history.goBack} />
        </Fragment>
      );
    }
    return <Layout>{view}</Layout>;
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(null, mapDispatchToProps)(withRouter(WorkoutEditor));
