import {
  React,
  Component,
  Fragment,
  connect,
  styled,
  colors,
  filters,
} from "src/imports/react";
import { Icon, Modal } from "src/imports/components";
import { addEntryToDB } from "src/store/actions";

class CopyPair extends Component {
  state = {
    showCopyPair: false,
  };

  toggleShowCopyPair = () => {
    this.setState((state) => ({
      showCopyPair: !state.showCopyPair,
    }));
  };

  renderCopyingTab = () => {
    if (this.props.workoutToCopy) {
      return (
        <$CopyPairTab>
          Kopiujesz trening użytkownika {this.props.workoutToCopy.user.fullname}{" "}
          z dnia {filters.reverseDate(this.props.workoutToCopy.scheduled)}
          <$CloseButton
            onClick={this.props.addEntryToDB.bind(this, "workoutToCopy", null)}
          >
            <Icon name="cancel" />
          </$CloseButton>
        </$CopyPairTab>
      );
    } else {
      return null
    }
  };

  renderPairingTab = () => {
    if (this.props.workoutToPair) {
      return (
        <$CopyPairTab>
          Parujesz z treningiem użytkownika{" "}
          {this.props.workoutToPair.user.fullname} z dnia{" "}
          {filters.reverseDate(this.props.workoutToPair.scheduled)}
          <$CloseButton
            onClick={this.props.addEntryToDB.bind(this, "workoutToPair", null)}
          >
            <Icon name="cancel" />
          </$CloseButton>
        </$CopyPairTab>
      );
    } else { 
      return null
    }
  };

  renderTrigger = () => {
    if (!this.props.pathname.includes("users")) {
      return null;
    }

    if (this.props.workoutToPair || this.props.workoutToCopy) {
      return (
        <$Bell bell onClick={this.toggleShowCopyPair}>
          <Icon name="bell" />
        </$Bell>
      );
    }
  };

  render() {
    return (
      <Fragment>
        {this.renderTrigger()}
        {(this.state.showCopyPair && this.props.workoutToPair) ||
        (this.state.showCopyPair && this.props.workoutToCopy) ? (
          <Modal onClick={this.toggleShowCopyPair}>
            <$CopyPair>
              {this.renderPairingTab()}
              {this.renderCopyingTab()}
            </$CopyPair>
          </Modal>
        ) : null}
      </Fragment>
    );
  }
}

const $Bell = styled.li`
  color: inherit;
  color: ${colors.headers};
  margin-left: 5px;
  z-index: 1005;
`;

const $CopyPair = styled.ul`
  position: absolute;
  top: 3rem;
  left: 0;
  padding: 1rem;
`;

const $CopyPairTab = styled.li`
  background-color: ${colors.headers};
  padding: 0.5rem;
  color: black;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const $CloseButton = styled.button`
  margin-left: 3rem;
`;

const mapStateToProps = (state) => {
  return {
    workoutToPair: state.workouts.workoutToPair,
    workoutToCopy: state.workouts.workoutToCopy,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addEntryToDB: (key, entry) => dispatch(addEntryToDB(key, entry)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CopyPair);
