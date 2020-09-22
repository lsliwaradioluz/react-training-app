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
} from "src/imports/components";
import prepareSectionsForMutation from "src/utils/removeTypename"
import Carousel from "src/components/Carousel"

class WorkoutPage extends Component {
  state = {
    mounted: false,
    editingFeedback: false,
  };

  workout = null;
  editedUnit = null;

  setEditingFeedback = (payload) => {
    this.editedUnit = payload;
    this.setState(state => ({ editingFeedback: !state.editingFeedback }));
  };

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
    )  
};

  renderFeedbackEditor = () => {
    let feedbackEditor = null;
    if (this.state.editingFeedback) {
      feedbackEditor = (
        <Modal onClick={this.setEditingFeedback.bind(this, null)}>
          <FeedbackEditor
            clickReturn={this.setEditingFeedback.bind(this, null)}
            unit={this.editedUnit}
            onSave={this.editFeedback}
          />
        </Modal>
      );
    }
    return feedbackEditor;
  };

  editFeedback = async (newFeedback) => {
    this.editedUnit.feedback = newFeedback;
    try {
      this.updateWorkout()
      this.setState({ editingFeedback: false });
    } catch (err) {
      console.log(err)
    }
  };

  updateWorkout = () => {
    return apolloClient.mutate({
      mutation: UPDATE_WORKOUT,
      variables: {
        input: {
          id: this.workout.id, 
          sections: prepareSectionsForMutation(this.workout.sections),
        }
      },
    });
  };

  render() {
    const assistantLink = `${this.props.history.location.pathname}/assistant`

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
          <$Button to={assistantLink} theme="tertiary">Asystent</$Button>
          {this.renderSections()}
          {this.renderFeedbackEditor()}
        </DefaultLayout>
      );
    }
    return view;
  }
}

const $Button = styled(Button)`
  margin-top: 0;
  margin-bottom: 2rem;
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
