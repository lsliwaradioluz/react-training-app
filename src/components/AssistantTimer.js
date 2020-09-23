import { React, Component, styled, colors, Fragment } from "src/imports/react";
import { Icon } from "src/imports/components";

class AssistantTimer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: false,
      stopwatchMode: this.props.stopwatchMode,
    };
    this.time = this.props.stopwatchMode ? 0 : this.props.time;
    this.timerInterval = null;
    this.audio = new Audio(require(`../assets/sounds/beep-triple.mp3`));
  }

  componentDidMount() {
    if (!this.props.stopwatchMode) {
      this.props.updateTime(this.props.time);
      if (this.props.active && this.props.automatic) {
        this.start();
      }
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.stopwatchMode !== prevProps.stopwatchMode) {
      this.time = this.props.stopwatchMode ? 0 : this.props.time;
      this.props.updateTime(this.time);
      this.setState({ stopwatchMode: this.props.stopwatchMode });
      this.stop();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerInterval);
  }

  start = () => {
    this.setState({ running: true });
    this.timerInterval = setInterval(() => {
      if (this.state.stopwatchMode) {
        this.time++;
      } else {
        if (this.time > 0) {
          this.time--;
          if (this.state.running && this.props.soundOn) {
            if (this.time === 30) {
              this.playAudio("beep-triple.mp3");
            } else if (this.time === 20) {
              this.playAudio("beep-double.mp3");
            } else if ([10,3,2,1].includes(this.time)) {
              this.playAudio("beep-short.mp3")
            } else if (this.time === 0) {
              this.playAudio("beep-long.mp3")
            }
          }
        } else {
          this.stop();
          if (this.props.automatic) {
            this.props.countdownOver();
          }
          return;
        }
      }
      this.props.updateTime(this.time);
    }, 1000);
  };

  stop = () => {
    this.setState({ running: false });
    clearInterval(this.timerInterval);
  };

  reset = () => {
    if (this.state.stopwatchMode) {
      this.time = 0;
    } else {
      this.time = this.props.time;
    }
    this.props.updateTime(this.time);
  };

  decrement = () => {
    this.time--;
    this.props.updateTime(this.time);
  };

  increment = () => {
    this.time++;
    this.props.updateTime(this.time);
  };

  playAudio(audio) {
    this.audio.src = require(`../assets/sounds/${audio}`);
    this.audio.play();
  }

  renderButtons = () => {
    let buttons = [
      {
        iconName: "minus-1",
        cb: this.decrement,
        disabled: this.state.stopwatchMode
          ? true
          : !this.props.active || this.state.running,
      },
      {
        iconName: "add-button",
        cb: this.increment,
        disabled: this.state.stopwatchMode
          ? true
          : !this.props.active || this.state.running,
      },
      {
        iconName: "stop-1",
        cb: this.reset,
        disabled: this.state.stopwatchMode
          ? this.time === 0 || this.state.running
          : !this.props.active ||
            this.state.running ||
            this.time === this.props.time,
      },
      {
        iconName: this.state.running
          ? "pause-button"
          : "movie-player-play-button",
        cb: this.state.running ? this.stop : this.start,
        disabled: this.state.stopwatchMode
          ? false
          : !this.props.active || this.time == 0,
        big: true,
      },
    ];

    const buttonNodes = buttons.map((button, index) => {
      return (
        <$Control
          big={button.big}
          key={index}
          onClick={button.cb}
          disabled={button.disabled}
        >
          <Icon name={button.iconName} />
        </$Control>
      );
    });

    return <Fragment>{buttonNodes}</Fragment>;
  };

  render = () => {
    return <$Timer>{this.renderButtons()}</$Timer>;
  };
}

const $Timer = styled.div`
  display: flex;
`;

const $Control = styled.button`
  margin-right: ${(props) => (props.big ? "0" : ".75rem")};
  font-size: ${(props) => (props.big ? "32px" : "18px")};
  opacity: ${(props) => (props.disabled ? "0.3" : "1")};
`;

export default AssistantTimer;
