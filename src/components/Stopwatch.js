import { React, Component, styled, colors, connect } from "src/imports/react";
import { Button, Icon } from "src/imports/components";
import { runStopwatch, stopStopwatch, resetStopwatch } from "src/store/actions";

class Stopwatch extends Component {
  start = () => {
    const stopwatchInterval = setInterval(() => {
      this.props.runStopwatch(stopwatchInterval);
    }, 10);
  };

  stop = () => {
    clearInterval(this.props.stopwatchInterval);
    this.props.stopStopwatch();
  };

  reset = () => {
    this.props.resetStopwatch();
  };

  getMiliseconds = () => {
    return this.props.stopwatchTime % 100 < 10
      ? `0${this.props.stopwatchTime % 100}`
      : `${this.props.stopwatchTime % 100}`;
  };

  getSeconds = () => {
    let seconds = Math.floor(this.props.stopwatchTime / 100);
    if (seconds >= 60) {
      seconds = Math.floor(seconds % 60);
    }
    return seconds < 10 ? `0${seconds}` : `${seconds}`;
  };

  getMinutes = () => {
    return Math.floor(this.props.stopwatchTime / 6000) < 10
      ? `0${Math.floor(this.props.stopwatchTime / 6000)}`
      : `${Math.floor(this.props.stopwatchTime / 6000)}`;
  };

  renderButtons = () => {
    let buttons = [];
    if (this.props.stopwatchInterval) {
      buttons.push({ iconName: "pause-button", cb: this.stop });
    } else {
      buttons.push({ iconName: "movie-player-play-button", cb: this.start });
      if (this.props.stopwatchTime > 0) {
        buttons.push({ iconName: "stop-1", cb: this.reset });
      }
    }

    const buttonNodes = buttons.map((button, index) => (
      <$Button key={index} onClick={button.cb}>
        <Icon name={button.iconName} />
      </$Button>
    ));

    return <$Buttons>{buttonNodes}</$Buttons>;
  };

  render() {
    return (
      <$Stopwatch>
        <$Header>Stoper</$Header>
        <$Body>
          {this.renderButtons()}
          <$Time>{`${this.getMinutes()}:${this.getSeconds()}.${this.getMiliseconds()}`}</$Time>
        </$Body>
        <Button click={this.props.close}>Zamknij</Button>
      </$Stopwatch>
    );
  }
}

const $Stopwatch = styled.div`
  padding: 1rem;
  padding-bottom: 0;
  background-color: ${colors.primary};
  border-radius: 6px;
  display: flex;
  flex-direction: column;
`;

const $Header = styled.h2`
  color: ${colors.headers};
`;
const $Body = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 0;
`;

const $Time = styled.p`
  margin: 0;
  display: flex;
  justify-content: center;
  font-size: 36px;
  line-height: 1;
`;

const $Buttons = styled.div`
  display: flex;
`;

const $Button = styled.button`
  font-size: 32px;
  margin-right: 1rem;
`;

const mapStateToProps = (state) => {
  return {
    stopwatchTime: state.stopwatch.currentTime,
    stopwatchInterval: state.stopwatch.interval,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    runStopwatch: (interval) => dispatch(runStopwatch(interval)),
    stopStopwatch: () => dispatch(stopStopwatch()),
    resetStopwatch: () => dispatch(resetStopwatch()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Stopwatch);
