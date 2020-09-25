import { React, Component, colors, styled, connect } from "src/imports/react";

class Loading extends Component {
  progressBarInterval = null;
  state = {
    progress: 0, 
  }

  increaseProgress = () => {
    this.setState(state => ({ progress: state.progress + 1}))
    if (this.state.progress === 105) {
      this.setState({ progress: 0 })
      clearInterval(this.progressBarInterval)
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.loading && this.props.loading) {
      this.progressBarInterval = setInterval(this.increaseProgress, 50);
    } else if (prevProps.loading && !this.props.loading) {
      clearInterval(this.progressBarInterval)
      const newTime = this.state.progress > 60 ? 25 : 10 
      this.progressBarInterval = setInterval(this.increaseProgress, newTime);
    }
  }

  render() {
    if (this.state.progress) {
      return <$Loading width={this.state.progress} />;
    } else {
      return null
    }
  }
}

const $Loading = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  width: ${props => props.width}%;
  background-color: ${colors.headers};
`;

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
  };
};

export default connect(mapStateToProps)(Loading);
