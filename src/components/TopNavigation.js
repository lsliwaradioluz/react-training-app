import {
  React,
  Component,
  styled,
  colors,
  withRouter,
  connect,
  css,
} from "src/imports/react";
import { Icon, Modal } from "src/imports/components";
import CopyPair from "src/components/CopyPair";

class topNavigation extends Component {
  state = {
    showCopyPair: false,
  };

  toggleShowCopyPair = () => {
    this.setState((state) => ({
      showCopyPair: !state.showCopyPair,
    }));
  };

  reloadPage = () => {
    window.location.reload();
  };

  goBack = () => {
    this.props.history.goBack();
  };

  renderCopyPair = () => {
    if (
      (this.state.showCopyPair && this.props.workoutToPair) ||
      (this.state.showCopyPair && this.props.workoutToCopy)
    ) {
      return (
        <Modal onClick={this.toggleShowCopyPair}>
          <CopyPair />
        </Modal>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <nav>
        <$TopNavigation color={this.props.color}>
          <$Link onClick={this.goBack}>
            <Icon name="left-arrow-2" />
          </$Link>
          <$Container>
            <$Link onClick={this.reloadPage}>
              <Icon name="continuous" />
            </$Link>
            {(this.props.workoutToPair &&
              this.props.location.pathname.includes("users")) ||
            (this.props.workoutToCopy &&
              this.props.location.pathname.includes("users")) ? (
              <$Link bell onClick={this.toggleShowCopyPair}>
                <Icon name="bell" />
              </$Link>
            ) : null}
            {this.renderCopyPair()}
          </$Container>
        </$TopNavigation>
      </nav>
    );
  }
}

// Styles
const $TopNavigation = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1002;
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  color: ${(props) => (props.color ? props.color : colors.faded)};
`;

const bellStyles = css`
  color: ${colors.headers};
  margin-left: 5px;
  z-index: 1005;
`;

const $Link = styled.li`
  color: inherit;
  ${(props) => (props.bell ? bellStyles : null)}
`;

const $Container = styled.div`
  display: flex;
`;

const mapStateToProps = (state) => {
  return {
    workoutToPair: state.workoutToPair,
    workoutToCopy: state.workoutToCopy,
  };
};

export default connect(mapStateToProps)(withRouter(topNavigation));
