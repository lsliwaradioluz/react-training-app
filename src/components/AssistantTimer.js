import { React, Component, styled, connect } from "src/imports/react";
import { Icon } from "src/imports/components";
import {
  startTimer,
  setTimer,
  incrementTime,
  decrementTime,
  pauseTimer,
} from "src/store/actions";

class AssistantTimer extends Component {
  audio = new Audio(require(`../assets/sounds/beep-triple.mp3`));

  disableDecrementIncrementButtons = () => {
    return this.props.stopwatch
      ? true
      : !this.props.active || this.props.interval;
  };

  disableResetButton = () => {
    return this.props.stopwatch
      ? this.props.currentTime === 0 || this.props.interval
      : !this.props.active ||
          this.props.interval ||
          this.props.currentTime === this.props.initialTime;
  };

  disablePlayPauseButton = () => {
    return this.props.stopwatch
      ? false
      : !this.props.active || this.props.currentTime == 0;
  };

  componentDidMount() {
    if (
      this.props.active &&
      this.props.automatic &&
      !this.props.stopwatch &&
      !this.props.interval
    ) {
      this.start();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.stopwatch !== prevProps.stopwatch) {
      this.props.setTimer(this.props.stopwatch ? 0 : this.props.initialTime);
      this.props.pauseTimer();
    }

    if (
      this.props.interval &&
      this.props.currentTime === 0 &&
      this.props.automatic
    ) {
      setTimeout(this.props.countdownOver, 1000);
    }
  }

  runTimer = () => {
    this.props.decrementTime();
    this.playAudio();
  };

  start = () => {
    let timerInterval;
    if (this.props.stopwatch) {
      timerInterval = setInterval(this.props.runStopwatch, 1000);
    } else {
      timerInterval = setInterval(this.runTimer, 1000);
    }
    this.props.startTimer(timerInterval);
  };

  reset = () => {
    this.props.setTimer(this.props.stopwatch ? 0 : this.props.initialTime);
  };

  playAudio() {
    if (!this.props.interval || !this.props.soundOn) {
      return;
    }
    let audio;
    if (this.props.currentTime === 30) {
      audio = "beep-triple.mp3";
    } else if (this.props.currentTime === 20) {
      audio = "beep-double.mp3";
    } else if ([10, 3, 2, 1].includes(this.props.currentTime)) {
      audio = "beep-short.mp3";
    } else if (this.props.currentTime === 0) {
      audio = "beep-long.mp3";
    } else {
      return;
    }
    this.audio.src = require(`../assets/sounds/${audio}`);
    this.audio.play();
  }

  getButtons = () => {
    return [
      {
        iconName: "minus-1",
        cb: this.props.decrementTime,
        disabled: this.disableDecrementIncrementButtons(),
      },
      {
        iconName: "add-button",
        cb: this.props.incrementTime,
        disabled: this.disableDecrementIncrementButtons(),
      },
      {
        iconName: "stop-1",
        cb: this.reset,
        disabled: this.disableResetButton(),
      },
      {
        iconName: this.props.interval
          ? "pause-button"
          : "movie-player-play-button",
        cb: this.props.interval ? this.props.pauseTimer : this.start,
        disabled: this.disablePlayPauseButton(),
        big: true,
      },
    ];
  };

  render = () => {
    const buttonNodes = this.getButtons().map((button, index) => {
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

    return <$Timer>{buttonNodes}</$Timer>;
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

const mapStateToProps = (state) => {
  return {
    automatic: state.assistant.automaticModeOn,
    stopwatch: state.assistant.stopwatchModeOn,
    interval: state.assistant.timer.interval,
    currentTime: state.assistant.timer.time,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTimer: (time) => dispatch(setTimer(time)),
    startTimer: (interval) => dispatch(startTimer(interval)),
    pauseTimer: () => dispatch(pauseTimer()),
    runStopwatch: () => dispatch(incrementTime()),
    decrementTime: () => dispatch(decrementTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AssistantTimer);
