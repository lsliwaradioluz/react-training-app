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
import Stopwatch from "src/components/Stopwatch"

class WorkoutPage extends Component {
  state = {
    mounted: false,
    editingFeedback: false,
    showStopwatch: false,
  };

  workout = null;
  editedUnit = null;

  async componentDidMount() {
    const { data } = await apolloClient.query({
      query: GET_WORKOUT,
      variables: {
        id: this.props.match.params.id,
      },
    });

    this.workout = cloneDeep(data.workout);
    this.setState({ mounted: true });
  }

  setEditingFeedback = (payload) => {
    this.editedUnit = payload;
    this.setState((state) => ({ editingFeedback: !state.editingFeedback }));
  };

  editFeedback = async (newFeedback) => {
    this.editedUnit.feedback = newFeedback;
    try {
      this.updateWorkout();
      this.setState({ editingFeedback: false });
    } catch (err) {
      console.log(err);
    }
  };

  toggleShowStopwatch = () => {
    this.setState(state => ({ showStopwatch: !state.showStopwatch }))
  }

  updateWorkout = () => {
    return apolloClient.mutate({
      mutation: UPDATE_WORKOUT,
      variables: {
        input: {
          id: this.workout.id,
          sections: prepareSectionsForMutation(this.workout.sections),
        },
      },
    });
  };

  renderSectionButtons = (unit) => {
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
    const sections = this.workout.sections.map((section) => (
      <WorkoutSection
        key={section.id}
        section={section}
        unitButtons={this.renderSectionButtons}
      />
    ));
    return (
      <CarouselContainer>
        <Carousel>
          {sections}
          {sections}
        </Carousel>
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

  render() {
    const assistantLink = `${this.props.history.location.pathname}/assistant`;

    let view = (
      <DefaultLayout>
        <Placeholder />
      </DefaultLayout>
    );

    if (this.state.mounted) {
      view = (
        <DefaultLayout>
          <Header>
            Trening
            <Date date={this.workout.scheduled} />
          </Header>
          <p>
            Zapoznaj się z rozpiską, przesuwając palcem w lewo lub w prawo.
            Skorzystaj z Cyfrowego Asystenta, który przeprowadzi Cię przez Twój
            trening krok po kroku. Dodawaj komentarze do ćwiczeń, aby trener
            wiedział, jak Ci poszło.
          </p>
          <$Buttons>
            <$Button to={assistantLink} theme="tertiary">
              Asystent
            </$Button>
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

const $Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`

const $Button = styled(Button)`
  margin-top: 0;
  margin-bottom: 2rem;
  flex-basis: 49%;
`;

const $ContextMenuTrigger = styled(Icon)`
  font-size: 12px;
`;

const mapStateToProps = (state) => {
  return {
    userID: state.user.id,
  };
};

export default connect(mapStateToProps)(WorkoutPage);
