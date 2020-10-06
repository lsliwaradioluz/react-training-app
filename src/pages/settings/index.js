import {
  React,
  Component,
  styled,
  colors,
  connect,
  apolloClient,
  Fragment,
} from "src/imports/react";
import DefaultLayout from "src/layouts/Default";
import { Header, Input, Button, Loading } from "src/imports/components";
import { UPDATE_USER } from "src/imports/apollo";
import { setNotification, setUser } from "src/store/actions";
import FileManager from "src/components/FileManager";
import Avatar from "src/components/Avatar";

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        ...this.props.user,
      },
      removeFileOnUnmount: true,
      removeInitialFile: false,
    };
  }

  editDataHandler = (key, event) => {
    const newValue = event.target.value;
    this.setState((state) => {
      return { user: { ...state.user, [key]: newValue } };
    });
  };

  changeAvatar = (avatar) => {
    this.setState((state) => {
      return { user: { ...state.user, image: avatar } };
    });
  };

  updateUser = async () => {
    const input = {
      ...this.state.user,
      image: this.state.user.image && this.state.user.image._id,
    };

    try {
      const { data } = await apolloClient.mutate({
        mutation: UPDATE_USER,
        variables: { input },
      });
      const userToSet = data.updateUser;
      delete userToSet.__typename;

      this.props.setUser(userToSet);
      this.setState(
        {
          removeFileOnUnmount: false,
          removeInitialFile: this.state.user.image !== this.props.user.image,
        },
        this.props.history.goBack()
      );
      this.props.setNotification("Zmiana ustawień zakończona sukcesem!");
    } catch (err) {
      console.log(err);
      this.props.setNotification("Coś poszło nie tak");
    }
  };

  checkCanUpload = () => {
    for (let key in this.props.user) {
      if (this.props.user[key] !== this.state.user[key]) {
        return true;
      }
    }
    return false;
  };

  renderTopPanel = () => {
    return (
      <Fragment>
        <Avatar url={this.state.user.image && this.state.user.image.url} />
        <$TopPanel>
          <FileManager
            file={this.state.user.image}
            removeFileOnUnmount={this.state.removeFileOnUnmount}
            removeInitialFile={this.state.removeInitialFile}
            allowedFormat="image"
            addButtonCaption={
              this.state.user.image ? "Zmień awatar" : "Dodaj awatar"
            }
            deleteButtonCaption="Usuń awatar"
            onUploadFinish={this.changeAvatar}
            onFileDelete={this.changeAvatar.bind(this, null)}
          />
          <Button
            theme="tertiary"
            to={`${this.props.location.pathname}/change-password`}
          >
            Zmień hasło
          </Button>
        </$TopPanel>
      </Fragment>
    );
  };

  renderDataForm = () => {
    return (
      <form>
        <$FormHeader>Edytuj dane</$FormHeader>
        <Input
          placeholder="Imię i nazwisko"
          value={this.state.user.fullname}
          onChange={this.editDataHandler.bind(this, "fullname")}
        />
        <Input
          placeholder="Nazwa użytkownika"
          value={this.state.user.username}
          onChange={this.editDataHandler.bind(this, "username")}
        />
        <Input
          placeholder="Adres e-mail"
          value={this.state.user.email}
          onChange={this.editDataHandler.bind(this, "email")}
        />
        <$FormButtons>
          <Button click={this.updateUser} disabled={!this.checkCanUpload()}>
            Zapisz
          </Button>
          <Button click={this.props.history.goBack}>Wróć</Button>
        </$FormButtons>
      </form>
    );
  };

  render() {
    return (
      <DefaultLayout>
        <Header>Ustawienia</Header>
        {this.renderTopPanel()}
        {this.renderDataForm()}
      </DefaultLayout>
    );
  }
}

const $TopPanel = styled.div`
  display: flex;
  button,
  a {
    font-size: 12px;
    padding: 0.3rem;
    margin-right: 0.5rem;
  }
`;

const $FormHeader = styled.h3`
  color: ${colors.headers};
`;

const $FormButtons = styled.div`
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
    setUser: (user) => dispatch(setUser(user)),
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
