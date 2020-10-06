import {
  React,
  connect,
  colors,
  transition,
} from "src/imports/react";
import { setNotification } from "src/store/actions";

const Notification = (props) => {
  const unsetNotification = () => {
    props.setNotification(null);
  };

  let notificationDuration = 0

  if (props.notification) {
    notificationDuration = props.notification.length * 100
    setTimeout(unsetNotification, notificationDuration + 500);
  }

  return (
    <$Notification
      onClick={unsetNotification}
      unmountOnExit
      in={props.notification ? true : false}
      timeout={notificationDuration}
    >
      {props.notification}
    </$Notification>
  );
};

const $Notification = transition.p`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 10020;
  padding: 1rem;
  font-size: 13px;
  max-width: 450px;
  margin-bottom: 0;
  background-color: ${colors.headers};
  color: ${colors.primary};
  transition: transform .5s;
  transform: translateY(100%);
  &:enter-active {
    transform: translateY(0);
  }
`;

const mapStateToProps = (state) => {
  return {
    notification: state.notification,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
