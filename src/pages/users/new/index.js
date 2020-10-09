import {
  React,
  Component,
  apolloClient,
  styled,
  connect,
  cloneDeep,
} from "src/imports/react";
import { REGISTER, GET_USERS } from "src/imports/apollo";
import { setNotification } from "src/store/actions/main";
import DefaultLayout from "src/layouts/Default";
import { Header, Input, Button } from "src/imports/components";

class newUserPage extends Component {
  state = {
    fullname: "Piotr Stolarczyk",
    email: "piotr@gmail.com",
    password: "123456",
    repeatPassword: "123456",
    user: this.props.coach.id,
    admin: false,
  };

  updateState = (key, event) => {
    const newValue = event.target.value;
    this.setState({ [key]: newValue });
  };

  createUser = async () => {
    const input = { ...this.state };
    delete input.repeatPassword;

    try {
      await apolloClient.mutate({
        mutation: REGISTER,
        variables: { input },
        update: (cache, { data: { register } }) => {
          try {
            const { users } = cloneDeep(
              cache.readQuery({
                query: GET_USERS,
                variables: { id: this.props.coach.id },
              })
            );

            apolloClient.writeQuery({
              query: GET_USERS,
              variables: { id: this.props.coach.id },
              data: { users: [...users, register.user] },
            });
          } catch (err) {
            console.log(err);
          }
        },
      });
      this.props.setNotification("Nowy użytkownik dodany pomyślni!");
      this.props.history.goBack();
    } catch (err) {
      console.log(err);
      this.props.setNotification(
        "Coś poszło nie tak, sprawdź połączneie z Internetem."
      );
    }
  };

  render() {
    return (
      <DefaultLayout>
        <Header>Nowy podopieczny</Header>
        <p>
          Dodaj nowego podopiecznego, z którym będziesz trenował i ustal dla
          niego tymczasowe hasło. Będzie mógł zmienić je potem w ustawieniach
          swojego profilu.
        </p>
        <Input
          value={this.state.fullname}
          onChange={this.updateState.bind(this, "fullname")}
          placeholder="Imię i nazwisko"
        />
        <Input
          value={this.state.email}
          onChange={this.updateState.bind(this, "email")}
          placeholder="Adres e-mail"
          type="email"
        />
        <Input
          value={this.state.password}
          onChange={this.updateState.bind(this, "password")}
          placeholder="Hasło"
          type="password"
        />
        <Input
          value={this.state.repeatPassword}
          onChange={this.updateState.bind(this, "repeatPassword")}
          placeholder="Powtórz hasło"
          type="password"
        />
        <$Buttons>
          <Button click={this.createUser}>Zapisz</Button>
          <Button click={this.props.history.goBack}>Wróć</Button>
        </$Buttons>
      </DefaultLayout>
    );
  }
}

const $Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    flex-basis: 49%;
  }
`;

const mapStateToProps = (state) => {
  return {
    coach: state.main.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(newUserPage);
