import {
  React,
  Component,
  Fragment,
  styled,
  apolloClient,
  connect,
} from "src/imports/react";
import { GET_USER } from "src/imports/apollo";
import DefaultLayout from "src/layouts/Default";
import { Header, Button, Placeholder } from "src/imports/components";
import WorkoutTab from "src/components/WorkoutTab";

class Workouts extends Component {
  state = {
    showHomeworks: false,
    workouts: null,
  };

  async componentDidMount() {
    const { data } = await apolloClient.query({
      query: GET_USER,
      variables: { id: this.props.userID },
    });
    this.setState({ workouts: data.user.workouts });
  }

  toggleShowHomeworks = (value) => {
    this.setState({ showHomeworks: value });
  };

  renderWorkouts = () => {
    const filteredWorkouts = this.state.workouts.filter(
      (workout) => workout.sticky === this.state.showHomeworks
    );

    let view = (
      <Fragment>
        {filteredWorkouts.map((workout) => (
          <WorkoutTab workout={workout} key={workout.id} />
        ))}
      </Fragment>
    )

    if (filteredWorkouts.length === 0) {
      view = <p>Brak treningów do wyświetlenia</p>;
    }

    return view
  };

  render() {
    let view = (
      <DefaultLayout>
        <Placeholder />
      </DefaultLayout>
    )

    if (this.state.workouts) {
      view = (
        <DefaultLayout>
          <Header>Twoje treningi</Header>
          <$Caption>
            Poniżej znajduje się lista wszystkich Twoich treningów. Znajdziesz
            wśród nich zarówno regularne treningi, jak i zadania domowe do
            wykonywania w dni nietreningowe lub zgodnie z zaleceniami trenera.
          </$Caption>
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
        </DefaultLayout>
      )
    }

    return view
  }
}

const $Caption = styled.p`
  margin-bottom: 0;
`;

const $Buttons = styled.div`
  display: flex;
`;

const mapStateToProps = (state) => {
  return {
    userID: state.user.id,
  };
};

export default connect(mapStateToProps)(Workouts);
