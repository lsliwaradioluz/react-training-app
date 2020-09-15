import {
  React,
  Component,
  Fragment,
  styled,
  apolloClient,
  connect,
  cloneDeep,
  withRouter,
} from "src/imports/react";
import { Input, Button } from "src/imports/components";
import { CREATE_FAMILY, UPDATE_FAMILY, GET_FAMILIES } from "src/imports/apollo";
import { setNotification } from "src/store/actions";

class FamilyEditor extends Component {
  state = {
    familyName: this.props.family ? this.props.family.name : "",
  };

  setFamilyName = (event) => {
    this.setState({ familyName: event.target.value });
  };

  goBack = () => {
    this.props.history.goBack();
  };

  verifyInputs = () => {
    if (this.state.familyName.length < 3) {
      const message = "Tekst w każdym z pól musi mieć co najmniej 3 znaki";
      this.props.setNotification(message);
      return false;
    } else {
      return true;
    }
  };

  saveFamily = async () => {
    if (!this.verifyInputs()) {
      return;
    }

    let mutationConfig,
      input = {
        name: this.state.familyName,
      };

    if (this.props.family) {
      input.id = this.props.family.id;
      mutationConfig = {
        mutation: UPDATE_FAMILY,
        variables: { input },
      };
    } else {
      input.user = this.props.userID;
      mutationConfig = {
        mutation: CREATE_FAMILY,
        variables: { input },
        update: (cache, { data: { createFamily } }) => {
          try {
            const data = cloneDeep(
              cache.readQuery({
                query: GET_FAMILIES,
                variables: { userId: this.props.userID },
              })
            );

            apolloClient.writeQuery({
              query: GET_FAMILIES,
              variables: { userId: this.props.userID },
              data: {
                families: [createFamily, ...data.families],
              },
            });
          } catch (err) {
            if (err.message !== "Cannot read property 'families' of null") {
              this.props.setNotification(
                "Nie udało się wykonać operacji. Sprawdź połączenie z Internetem"
              );
            }
          }
        },
      };
    }

    try {
      await apolloClient.mutate(mutationConfig);
      this.goBack();
    } catch (err) {
      console.log(err);
      const message =
        "Nie udało się wykonać operacji. Sprawdź połączenie z Internetem";
      this.props.setNotification(message);
    }
  };

  render() {
    return (
      <Fragment>
        <Input
          placeholder="Nazwa kategorii"
          value={this.state.familyName}
          onChange={this.setFamilyName}
        />
        <$Buttons>
          <$Button click={this.saveFamily}>Zapisz</$Button>
          <$Button click={this.goBack}>Anuluj</$Button>
        </$Buttons>
      </Fragment>
    );
  }
}

const $Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;
const $Button = styled(Button)`
  width: 49%;
`;

const mapStateToProps = (state) => {
  return {
    userID: state.user.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(FamilyEditor));
