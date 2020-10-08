import {
  React,
  Component,
  styled,
  apolloClient,
  connect,
  cloneDeep,
} from "src/imports/react";
import { GET_WORKOUT, UPDATE_WORKOUT } from "src/imports/apollo";
import DefaultLayout from "src/layouts/Default";
import Date from "src/components/Date";
import WorkoutSection from "src/components/WorkoutSection";
import FeedbackEditor from "src/components/FeedbackEditor";
import {
  Header,
  Button,
  Placeholder,
  CarouselContainer,
  ContextMenu,
  Icon,
  Modal,
  Carousel,
} from "src/imports/components";
import prepareSectionsForMutation from "src/utils/removeTypename";
import Stopwatch from "src/components/Stopwatch";
import { addEntryToDB, setNotification } from "src/store/actions";

class WorkoutPage extends Component {
  state = {
    mounted: false,
    currentWorkout: 0,
    editingFeedback: false,
    showStopwatch: false,
  };

  workouts = [];
  editedUnit = null;

  async componentDidMount() {
    const { data } = await apolloClient.query({
      query: GET_WORKOUT,
      variables: {
        id: this.props.match.params.id,
      },
    });

    this.workouts.push(cloneDeep(data.workout));
    if (this.props.workoutToPair) {
      this.workouts.push(this.props.workoutToPair);
    }
    this.setState({ mounted: true });
  }

  toggleCurrentWorkout = () => {
    this.setState((state) => ({
      currentWorkout: state.currentWorkout === 0 ? 1 : 0,
    }));
  };

  setEditingFeedback = (payload) => {
    this.editedUnit = payload;
    this.setState((state) => ({ editingFeedback: !state.editingFeedback }));
  };

  editFeedback = async (newFeedback) => {
    this.editedUnit.feedback = newFeedback;
    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_WORKOUT,
        variables: {
          input: {
            id: this.workouts[this.state.currentWorkout].id,
            sections: prepareSectionsForMutation(
              this.workouts[this.state.currentWorkout].sections
            ),
          },
        },
      });
      if (
        this.props.workoutToPair &&
        this.props.workoutToPair.id === data.updateWorkout.id
      ) {
        this.props.addEntryToDB("workoutToPair", {
          ...data.updateWorkout,
          user: this.props.workoutToPair.user,
        });
      }
      this.props.setNotification("Notatka zapisana!");
      this.setState({ editingFeedback: false });
    } catch (err) {
      console.log(err);
      this.props.setNotification("Nie udało się zapisać notatki");
    }
  };

  toggleShowStopwatch = () => {
    this.setState((state) => ({ showStopwatch: !state.showStopwatch }));
  };

  renderUnitButtons = (unit) => {
    let buttons = [
      {
        caption: "Dodaj notatkę",
        icon: "pencil",
        callback: this.setEditingFeedback.bind(this, unit),
      },
    ];
    if (unit.exercise.image) {
      buttons.unshift({
        caption: "Zobacz ćwiczenie",
        icon: "gymnast",
        link: {
          pathname: `/exercises/${unit.exercise.family.id}`,
          state: { exerciseID: unit.exercise.id },
        },
      });
    }
    return (
      <ContextMenu
        trigger={<$ContextMenuTrigger name="vertical-dots" />}
        buttons={buttons}
      />
    );
  };

  renderSections = () => {
    const sections = this.workouts[
      this.state.currentWorkout
    ].sections.map((section) => (
      <WorkoutSection
        key={section.id}
        section={section}
        unitButtons={this.renderUnitButtons}
      />
    ));
    return (
      <CarouselContainer>
        <Carousel>{sections}</Carousel>
      </CarouselContainer>
    );
  };

  renderFeedbackEditor = () => {
    if (this.state.editingFeedback) {
      return (
        <Modal>
          <FeedbackEditor
            clickReturn={this.setEditingFeedback.bind(this, null)}
            unit={this.editedUnit}
            onSave={this.editFeedback}
          />
        </Modal>
      );
    } else {
      return null;
    }
  };

  renderStopwatch = () => {
    if (this.state.showStopwatch) {
      return (
        <Modal>
          <Stopwatch close={this.toggleShowStopwatch} />
        </Modal>
      );
    } else {
      return null;
    }
  };

  renderHeader = () => {
    let headerText = "Trening";
    let switchButton = null;
    if (this.workouts.length > 1) {
      switchButton = (
        <$SwitchButton onClick={this.toggleCurrentWorkout}>
          {this.workouts[this.state.currentWorkout === 0 ? 1 : 0].user.username}
        </$SwitchButton>
      );
    }

    if (
      (this.props.viewingUser.admin &&
        this.workouts[this.state.currentWorkout].user.username !==
          this.props.viewingUser.username) ||
      this.props.workoutToPair
    ) {
      headerText = this.workouts[this.state.currentWorkout].user.username;
    }

    return (
      <div>
        {switchButton}
        <Header>
          {headerText}
          <Date date={this.workouts[this.state.currentWorkout].scheduled} />
        </Header>
      </div>
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
        <DefaultLayout>
          {this.renderHeader()}
          <p>
            Zapoznaj się z rozpiską, przesuwając palcem w lewo lub w prawo.
            Skorzystaj z Cyfrowego Asystenta, który przeprowadzi Cię przez Twój
            trening krok po kroku. Dodawaj komentarze do ćwiczeń, aby trener
            wiedział, jak Ci poszło.
          </p>
          <$Buttons>
            {this.workouts.length > 1 ? null : (
              <$Button
                to={`${this.props.history.location.pathname}/assistant`}
                theme="tertiary"
              >
                Asystent
              </$Button>
            )}
            {this.props.viewingUser.admin ? (
              <$Button
                to={{
                  pathname: `${this.props.location.pathname}/edit`,
                  state: {
                    userID: this.workouts[this.state.currentWorkout].user.id,
                  },
                }}
                theme="tertiary"
                middle={this.workouts.length === 1}
              >
                Edytuj
              </$Button>
            ) : null}
            <$Button click={this.toggleShowStopwatch} theme="tertiary">
              Stoper
            </$Button>
          </$Buttons>
          {this.renderSections()}
          {this.renderFeedbackEditor()}
          {this.renderStopwatch()}
        </DefaultLayout>
      );
    }
    return view;
  }
}

const $SwitchButton = styled.button`
  font-family: "Teko", sans-serif;
  font-size: 15px;
  letter-spacing: 0.4px;
`;

const $Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const $Button = styled(Button)`
  margin: ${(props) => (props.middle ? "0 6px 2rem 6px" : "0 0 2rem 0")};
  flex-basis: 49%;
`;

const $ContextMenuTrigger = styled(Icon)`
  font-size: 12px;
`;

const mapStateToProps = (state) => {
  return {
    viewingUser: state.main.user,
    workoutToPair: state.workouts.workoutToPair,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
    addEntryToDB: (key, entry) => dispatch(addEntryToDB(key, entry)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkoutPage);
