import {
  React,
  Component,
  styled,
  apolloClient,
  connect,
} from "src/imports/react";
import { GET_USER } from "src/imports/apollo";
import DefaultLayout from "src/layouts/Default";
import { Header, Placeholder } from "src/imports/components";
import WorkoutList from "src/components/WorkoutList"

class WorkoutsPage extends Component {
  state = {
    user: null,
  };

  async componentDidMount() {
    const { data } = await apolloClient.query({
      query: GET_USER,
      variables: { id: this.props.userID },
    });
    this.setState({ user: data.user });
  }

  render() {
    let view = (
      <DefaultLayout>
        <Placeholder />
      </DefaultLayout>
    )

    if (this.state.user) {
      view = (
        <DefaultLayout>
          <Header>Twoje treningi</Header>
          <$Caption>
            Poniżej znajduje się lista wszystkich Twoich treningów. Znajdziesz
            wśród nich zarówno regularne treningi, jak i zadania domowe do
            wykonywania w dni nietreningowe lub zgodnie z zaleceniami trenera.
          </$Caption>
          <WorkoutList user={this.state.user} />          
        </DefaultLayout>
      )
    }

    return view
  }
}

const $Caption = styled.p`
  margin-bottom: 0;
`;

const mapStateToProps = (state) => {
  return {
    userID: state.main.user.id,
  };
};

export default connect(mapStateToProps)(WorkoutsPage);
