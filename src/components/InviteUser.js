import { React, Component, styled, colors, connect } from "src/imports/react";
import { Input, Button } from "src/imports/components";
import { setNotification } from "src/store/actions";

class InviteUser extends Component {
  state = {
    fullName: "",
    email: "",
  };

  editDataHandler = (key, event) => {
    const newValue = event.target.value;
    this.setState({ [key]: newValue });
  };

  sendInvitation = () => {
    const domain =
      process.env.NODE_ENV == "development"
        ? `http://localhost:3000/`
        : `https://piti.live/`;

    const link = `register-trainee?name=${this.state.fullName}&email=${this.state.email}&coach=${this.props.user.id}`;

    const data = {
      from: "Piti@piti.live",
      to: this.state.email,
      subject: `Trener ${this.props.user.fullname} zaprasza się do wspólnego trenowania!`,
      html: `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email template</title>
          </head> 
          <body 
            style="
              margin: 0;
              padding: 0; 
              font-family: 'Helvetica Neue', sans-serif; 
              background-color: #F9F9F9;
              font-size: 90%;"> 
            <div style="padding: 3rem 0;">
              <div style="
                color: white;
                background-color: #23283C; 
                padding: 3rem 2rem; 
                margin: 0 auto; 
                max-width: 400px;">
                <img style="width: 100%;" src="https://images.unsplash.com/photo-1580086229554-1c2a34000456?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=994&q=80">
                <h2 
                  style="
                    color: #FDDCBD; 
                    margin-top: 1rem; 
                    margin-bottom: 0;
                    font-weight: 500;"> 
                    Cześć, ${this.state.fullName}! 
                </h2> 
                <p style="line-height: 1.4;">
                  Twój trener ${this.props.user.fullname} wysyła Ci zaproszenie do aplikacji Piti, która umożliwi Wam dzielenie się rozpiskami treningowymi. Klikając przycisk poniżej przeniesiesz się do formularza ustalającego hasło dla Twojego konta.
                </p> 
                <a 
                  href="${domain}${link}" 
                  style="
                    display: inline-block; 
                    text-decoration: none;
                    padding: .5rem 1.5rem; 
                    border-radius: 6px; 
                    color: #222E50; 
                    background-color: #FDDCBD; 
                    border: none; 
                    font-weight: 400; 
                    font-size: 14px; 
                    line-height: 1.5;"> 
                    Dokończ rejestrację 
                </a> 
              </div> 
            </div> 
          </body>
        </html>`,
    };

    fetch(`http://localhost:1337/api/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        this.props.onClose();
        this.props.setNotification(
          "Zaproszenie zostało wysłane na podany adres e-mail!"
        );
      })
      .catch((err) => {
        this.props.setNotification(
          "Wysyłanie nie powiodło się. Sprawdź połączenie z Internetem."
        );
      });
  }

  render() {
    return (
      <$InviteUser>
        <h2>Zaproś użytkownika</h2>
        <p>
          Uzupełnij dane podopiecznego, aby wysłać mu zaproszenie do aplikacji
          Piti. Drogą mailową otrzyma link aktywacyjny, dzięki któremu dokończy
          rejestrację.
        </p>
        <Input
          placeholder="Imię i nazwisko"
          value={this.state.fullName}
          onChange={this.editDataHandler.bind(this, "fullName")}
        />
        <Input
          placeholder="Adres e-mail"
          value={this.state.email}
          onChange={this.editDataHandler.bind(this, "email")}
        />
        <$InviteUserButtons>
          <Button click={this.sendInvitation}>Zaproś</Button>
          <Button click={this.props.onClose}>Wróć</Button>
        </$InviteUserButtons>
      </$InviteUser>
    );
  }
}

const $InviteUser = styled.div`
  padding: 1rem;
  padding-bottom: 0;
  background-color: ${colors.primary};
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  h2 {
    color: ${colors.headers};
  }
`;

const $InviteUserButtons = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    flex-basis: 49%;
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteUser);
