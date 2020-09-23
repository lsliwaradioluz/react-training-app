import { React, Component, styled, colors } from "src/imports/react";
import { Button, Icon } from "src/imports/components";

class Stopwatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: 0,
      running: false,
    };
    this.timerInterval = null;
  }

  start = () => {
    this.setState({ running: true });
    this.timerInterval = setInterval(() => {
      this.setState((state) => ({ time: state.time + 1 }));
    }, 10);
  };

  stop = () => {
    this.setState({ running: false });
    clearInterval(this.timerInterval);
  };

  reset = () => {
    this.setState({ time: 0 });
  };

  renderTime = () => {
    const miliseconds =
      this.state.time % 100 < 10
        ? `0${this.state.time % 100}`
        : `${this.state.time % 100}`;
    let seconds = Math.floor(this.state.time / 100);
    if (seconds >= 60) {
      seconds = Math.floor(seconds % 60);
    }
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const minutes =
      Math.floor(this.state.time / 6000) < 10
        ? `0${Math.floor(this.state.time / 6000)}`
        : `${Math.floor(this.state.time / 6000)}`;
    return <$Time>{`${minutes}:${seconds}.${miliseconds}`}</$Time>;
  };

  renderButtons = () => {
    let buttons = [];
    if (this.state.running) {
      buttons.push({ iconName: "pause-button", cb: this.stop });
    } else {
      buttons.push({ iconName: "movie-player-play-button", cb: this.start });
      if (this.state.time > 0) {
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
          {this.renderTime()}
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

export default Stopwatch;
