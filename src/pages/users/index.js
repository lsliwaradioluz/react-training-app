import {
  React,
  Component,
  styled,
  connect,
  apolloClient,
  Fragment,
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
import InviteUser from "src/components/InviteUser";

class Users extends Component {
  state = {
    users: null,
    showActive: true,
    filter: "",
    showInviteUser: false,
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

  toggleShowInviteUser = () => {
    this.setState((state) => ({ showInviteUser: !state.showInviteUser }));
  };

  setFilter = (event) => {
    const newValue = event.target.value;
    this.setState({ filter: newValue });
  };

  renderUserTabs = () => {
    let filteredUsers = this.state.users.filter((user) => {
      return (
        (user.fullname
          .toLowerCase()
          .includes(this.state.filter.toLowerCase().trim()) &&
          user.active === this.state.showActive) ||
        (user.username
          .toLowerCase()
          .includes(this.state.filter.toLowerCase().trim()) &&
          user.active === this.state.showActive)
      );
    });

    let userTabs = <p>Brak podopiecznych spełniających podane kryteria</p>;

    if (filteredUsers.length > 0) {
      userTabs = filteredUsers.map((user, index) => {
        return (
          <UserTab
            user={user}
            key={index}
            pathname={this.props.history.location.pathname}
            onUserArchive={this.getUsers}
          />
        );
      });
    }

    return <Fragment>{userTabs}</Fragment>;
  };

  renderInviteUser = () => {
    if (!this.state.showInviteUser) {
      return null;
    }

    return (
      <Modal onClick={this.toggleShowInviteUser}>
        <InviteUser onClose={this.toggleShowInviteUser} />
      </Modal>
    );
  };

  render() {
    let view = <Placeholder />;
    if (this.state.users) {
      view = (
        <Fragment>
          <Header>
            Podopieczni
            <button type="button" onClick={this.toggleShowInviteUser}>
              <$Icon name="plus" />
            </button>
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
          {this.renderInviteUser()}
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

const mapStateToProps = (state) => {
  return {
    userID: state.user.id,
  };
};

export default connect(mapStateToProps)(Users);
