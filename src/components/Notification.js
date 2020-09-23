import { React, connect, styled, colors } from "src/imports/react";
import { setNotification } from "src/store/actions";

const Notification = (props) => {
  const unsetNotification = () => {
    props.setNotification(null);
  };

  let notification = null;
  if (props.notification) {
    const notificationDuration =
      props.notification.length * 50 > 1000
        ? props.notification.length * 50
        : 1000;

    notification = <$Notification onClick={unsetNotification}>{props.notification}</$Notification>;
    setTimeout(unsetNotification, notificationDuration);
  }

  return notification;
};

const $Notification = styled.p`
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
