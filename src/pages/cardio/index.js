import {
  React,
  Component,
  styled,
  keyframes,
  Fragment,
  css,
} from "src/imports/react";

import { Icon } from "src/imports/components";

class CardioPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heartRate: null,
      maxHeartRate: 188,
    };
    this.data = [];
    this.HRzones = [
      { name: "rest", min: 0, max: 60, color: "#46C7EE" },
      { name: "light", min: 60, max: 70, color: "#9DBE4B" },
      { name: "moderate", min: 70, max: 80, color: "#FFBB1F" },
      { name: "hard", min: 80, max: 100, color: "#ff7621" },
    ];
  }

  onHeartRateChange = (event) => {
    const val = Math.abs(event.target.value.getInt8(1));
    // this.data.push(val / 2);
    // let arr = this.data.slice(-200);
    // if (arr.length < 200) {
    //   const fill = [];
    //   let n = 200 - arr.length;
    //   while (n--) fill.push(arr[0]);
    //   arr = fill.concat(arr);
    // }
    console.log(val)
    this.setState({ heartRate: val });
  };

  connectDevice = async (connectProps) => {
    const device = await navigator.bluetooth.requestDevice({
      // filters: [{ services: ["heart_rate"] }],
      acceptAllDevices: true,
    });
    const server = await device.gatt.connect();
    const service = await server.getPrimaryService("heart_rate");
    const char = await service.getCharacteristic("heart_rate_measurement");
    char.oncharacteristicvaluechanged = connectProps.onChange;
    char.startNotifications();
    return char;
  };

  getHRMaxPercentage = () => {
    const HRMaxPerc = Math.abs(Math.floor(
      (this.state.heartRate / this.state.maxHeartRate) * 100
    ));
    return HRMaxPerc;
  };

  getHeartRateZone = (percentage) => {
    const currentZone = this.HRzones.find((zone) => {
      return percentage >= zone.min && percentage < zone.max;
    });
    return currentZone;
  };

  renderUserTab = () => {
    const HRMaxPerc = this.getHRMaxPercentage();
    const zone = this.getHeartRateZone(HRMaxPerc);
    return (
      <$DeviceTab color={zone.color}>
        <$UserName>Łukasz ś.</$UserName>
        <$UserData>
          <div>
            <$UserHR>
              <$Icon name="cardiogram-1" />
              {this.state.heartRate}
            </$UserHR>
            <$UserCalorie>
              <$Icon name="fire-flame" />
              112
            </$UserCalorie>
          </div>
          <$UserHRMax>{HRMaxPerc}%</$UserHRMax>
        </$UserData>
      </$DeviceTab>
    );
  };

  render() {
    let view = (
      <Fragment>
        <$Header>Brak połączonych urządzeń.</$Header>
        <$Button
          onClick={this.connectDevice.bind(this, {
            onChange: this.onHeartRateChange,
          })}
        >
          Połącz teraz
        </$Button>
      </Fragment>
    );

    if (this.state.heartRate) {
      view = this.renderUserTab();
    }

    return <$Cardio connected={this.state.heartRate}>{view}</$Cardio>;
  }
}

// tego urządzenia nie ma jeszcze w bazie. Jak je nazwać?

const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const connectedStyles = css`
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  background: black;
  animation: none;
`;

const $Cardio = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  ${(props) => (props.connected ? connectedStyles : null)}
`;

const $Header = styled.h3`
  color: white;
  font-weight: 500;
`;

const $Button = styled.button`
  color: white;
  padding: 1rem 3rem;
  border: 2px solid white;
  border-radius: 30px;
`;

const $DeviceTab = styled.div`
  height: 250px;
  width: 350px;
  background-color: ${(props) => props.color};
  padding: 1rem;
  color: white;
  transition: background-color 0.3s linear;
`;

const $UserName = styled.h3`
  text-transform: uppercase;
  font-weight: 400;
  font-size: 50px;
`;

const $UserData = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const $Icon = styled(Icon)`
  margin-right: 5px;
`;

const $UserHR = styled.div`
  display: flex;
  font-size: 40px;
  font-weight: 400;
`;

const $UserCalorie = styled.div`
  display: flex;
  font-size: 40px;
  font-weight: 400;
`;

const $UserHRMax = styled.h2`
  font-size: 84px;
  margin: 0;
`;

export default CardioPage;
