import { React, Component, styled, connect, apolloClient } from "src/imports/react";
import { Header, Input, Button } from "src/imports/components";
import DefaultLayout from "src/layouts/Default";
import { setNotification } from "src/store/actions";
import { UPDATE_USER } from "src/imports/apollo"

class ChangePassword extends Component {
  state = {
    password: "",
    repeatPassword: "",
  };

  editPassword = (key, event) => {
    const newValue = event.target.value;
    this.setState({ [key]: newValue });
  };

  verifyPassword = () => {
    let passwordCorrect = true
    if (this.state.password !== this.state.repeatPassword) {
      this.props.setNotification("Podane hasła nie są takie same!");
      passwordCorrect = false
    } else if (this.state.password.length < 5) {
      this.props.setNotification("Hasło musi składać się z co najmniej 5 znaków");
      passwordCorrect = false
    }
    return passwordCorrect
  }

  savePassword = async () => {
    if (!this.verifyPassword()) {
      return
    }

    const input = {
      id: this.props.user.id, 
      password: this.state.password,
    }

    try {
      await apolloClient.mutate({ mutation: UPDATE_USER, variables: { input } })
      this.props.history.goBack()
      this.props.setNotification("Zmiana hasła zakończona sukcesem!")
    } catch (err) {
      console.log(err)
      this.props.setNotification("Coś poszło nie tak. Sprawdź połączenie z Internetem")
    }
  };

  render() {
    return (
      <DefaultLayout>
        <Header>Zmień hasło</Header>
        <p>
          Ze względów bezpieczeństwa wprowadź nowe hasło dwa razy. Pamiętaj, że
          skomplikowane hasło to najlepsze zabezpieczenie Twojego konta.
        </p>
        <form>
          <Input
            type="password"
            placeholder="Nowe hasło"
            value={this.state.password}
            onChange={this.editPassword.bind(this, "password")}
          />
          <Input
            type="password"
            placeholder="Powtórz hasło"
            value={this.state.repeatPassword}
            onChange={this.editPassword.bind(this, "repeatPassword")}
          />
        </form>
        <$Buttons>
          <Button disabled={!this.state.password || !this.state.repeatPassword} click={this.savePassword}>
            Zapisz
          </Button>
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
    user: state.main.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
