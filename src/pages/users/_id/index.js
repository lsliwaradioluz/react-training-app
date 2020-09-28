import { React, Component, apolloClient, colors, styled, NavLink } from "src/imports/react";
import { Header, Icon, Placeholder } from "src/imports/components";
import DefaultLayout from "src/layouts/Default";
import { GET_USER } from "src/imports/apollo";
import WorkoutList from "src/components/WorkoutList"

class UserPage extends Component {
  state = {
    user: null,
  };

  async componentDidMount() {
    const { data } = await apolloClient.query({
      query: GET_USER,
      variables: { id: this.props.match.params.id },
    });
    this.setState({ user: data.user });
  }

  render() {
    if (!this.state.user) {
      return (
        <DefaultLayout>
          <Placeholder />
        </DefaultLayout>
      );
    } else {
      return (
        <DefaultLayout>
          <Header>{this.state.user.fullname}</Header>
          <p>
            Paruj, aby wyświetlić rozpiskę wybranego treningu w połączeniu z
            innym. Kopiuj, aby móc skorzystać z wybranego treningu nawet u
            innego użytkownika.
          </p>
          <$Subheader>
            Lista treningów
            <NavLink to={`${this.props.history.location.pathname}/new-workout`}>
              <$Icon name="plus" />
            </NavLink>
          </$Subheader>
          <WorkoutList workouts={this.state.user.workouts} />
        </DefaultLayout>
      );
    }
  }
}

const $Subheader = styled.h3`
  color: ${colors.headers};
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
`

const $Icon = styled(Icon)`
  font-size: 18px;
`

export default UserPage;
