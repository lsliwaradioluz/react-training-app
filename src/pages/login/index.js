import {
  React,
  Component,
  apolloClient,
  withRouter,
  connect,
} from "src/imports/react";
import { Header, Input, Button } from "src/imports/components"
import { LOGIN } from "src/imports/apollo"
import AuthLayout from "src/layouts/Login";
import { setNotification, setUser } from "src/store/actions/index";

class Login extends Component {
  state = {
    identifier: "",
    password: "",
  };

  updateIdentifier = (event) => {
    this.setState({ identifier: event.target.value });
  };

  updatePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  signIn = async () => {
    const input = {
      identifier: this.state.identifier.toLowerCase(),
      password: this.state.password,
    };

    apolloClient
      .mutate({
        mutation: LOGIN,
        variables: { input },
      })
      .then((res) => {
        const user = res.data.login.user;
        const token = res.data.login.token;

        let userToSet = {
          id: user.id,
          username: user.username,
          fullname: user.fullname,
          email: user.email,
          image: user.image,
          admin: user.admin,
          active: user.active,
        };

        this.props.setUser(userToSet, token);
        this.props.history.push("/dashboard");
      })
      .catch((err) => {
        console.log(err)
        let message
        if (err.message === "User was not found") {
          message = "Nie znaleziono takiego użytkownika!"
        } else if (err.message === "Password is incorrect") {
          message = "Podane hasło jest nieprawidłowe!"
        } else {
          message = "Logowanie nie powiodło się. Sprawdź połączenie z Internetem"
        }
        this.props.setNotification(message)
      });
  };

  render() {
    return (
      <AuthLayout>
        <Header>Zaloguj się</Header>
        <Input
          placeholder="Nazwa użytkownika"
          value={this.state.identifier}
          onChange={this.updateIdentifier}
        />
        <Input
          placeholder="Hasło"
          type="password"
          value={this.state.password}
          onChange={this.updatePassword}
        />
        <Button click={this.signIn}>Zaloguj się</Button>
      </AuthLayout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user, token) => dispatch(setUser(user, token)),
    setNotification: (notification) => dispatch(setNotification(notification))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
