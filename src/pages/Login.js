import {
  React,
  Component,
  apolloClient,
  withRouter,
  connect,
} from "src/imports/react";
import { Header, Input, Button } from "src/imports/components"
import { LOGIN } from "src/imports/apollo"
import AuthLayout from "src/layouts/Auth";
import * as actionTypes from "src/store/actions";

class Login extends Component {
  state = {
    email: "lsliwaradioluz@gmail.com",
    password: "Manchester15151515",
  };

  updateEmail = (event) => {
    this.setState({ email: event.target.value });
  };

  updatePassword = (event) => {
    this.setState({ password: event.target.value });
  };

  signIn = async () => {
    const input = {
      identifier: this.state.email.toLowerCase(),
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
        console.log("Error", err);
      });
  };

  render() {
    return (
      <AuthLayout>
        <Header>Zaloguj się</Header>
        <Input
          placeholder="Adres e-mail"
          type="email"
          value={this.state.email}
          onChange={this.updateEmail}
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
    setUser: (user, token) => dispatch({ type: actionTypes.SET_USER, user, token }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
