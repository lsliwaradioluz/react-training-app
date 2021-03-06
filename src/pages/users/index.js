import {
  React,
  Component,
  styled,
  connect,
  apolloClient,
  Fragment, 
  NavLink,
} from "src/imports/react";
import DefaultLayout from "src/layouts/Default";
import {
  Header,
  Button,
  Input,
  Placeholder,
  Icon,
  Modal,
} from "src/imports/components";
import { GET_USERS } from "src/imports/apollo";
import UserTab from "src/components/UserTab";

class Users extends Component {
  state = {
    users: null,
    showActive: true,
    filter: "",
  };

  getUsers = async () => {
    const { data } = await apolloClient.query({
      query: GET_USERS,
      variables: { id: this.props.userID },
    });
    this.setState({ users: data.users });
  };

  componentDidMount() {
    this.getUsers();
  }

  toggleShowActive = (newValue) => {
    this.setState({ showActive: newValue });
  };

  setFilter = (event) => {
    const newValue = event.target.value;
    this.setState({ filter: newValue });
  };

  renderUserTabs = () => {
    let filteredUsers = this.state.users.filter((user) => {
      const fitsActive = user.active === this.state.showActive;
      const fitsFilter = `${user.fullname}${user.username}`
        .toLowerCase()
        .includes(this.state.filter.toLowerCase().trim());
      return fitsActive && fitsFilter
    });

    let userTabs = <p>Brak podopiecznych spełniających podane kryteria</p>;

    if (filteredUsers.length > 0) {
      userTabs = filteredUsers.map((user, index) => {
        return (
          <UserTab
            user={user}
            key={index}
            history={this.props.history}
            refetchUsers={this.getUsers}
          />
        );
      });
    }

    return <$UserTabs>{userTabs}</$UserTabs>;
  };

  render() {
    let view = <Placeholder />;
    if (this.state.users) {
      view = (
        <Fragment>
          <Header>
            Podopieczni
            <NavLink to="users/new">
              <$Icon name="plus" />
            </NavLink>
          </Header>
          <$Caption>
            Dotknij karty podopiecznego, by zobaczyć jego treningi. Jeżeli
            skończyliście współpracę, przenieś go do archiwum.
          </$Caption>
          <$Buttons>
            <Button
              theme="switch"
              active={this.state.showActive}
              click={this.toggleShowActive.bind(this, true)}
            >
              Aktywni
            </Button>
            <Button
              theme="switch"
              active={!this.state.showActive}
              click={this.toggleShowActive.bind(this, false)}
            >
              Archiwum
            </Button>
          </$Buttons>
          <Input
            placeholder="Wyszukaj podopiecznego"
            onChange={this.setFilter}
            value={this.state.filter}
            hideLabel
            search
          />
          {this.renderUserTabs()}
        </Fragment>
      );
    }
    return <DefaultLayout>{view}</DefaultLayout>;
  }
}

const $Icon = styled(Icon)`
  font-size: 18px;
  color: white;
`;

const $Caption = styled.p`
  margin-bottom: 0;
`;

const $Buttons = styled.div`
  display: flex;
  button {
    margin-bottom: 0;
  }
`;

const $UserTabs = styled.div`
  @media (min-width: 1024px) {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`

const mapStateToProps = (state) => {
  return {
    userID: state.main.user.id,
    workoutToPair: state.workouts.workoutToPair,
    workoutToCopy: state.workouts.workoutToCopy,
  };
};

export default connect(mapStateToProps)(Users);
