import { React, styled, NavLink as Link, colors, connect } from "src/imports/react";
import { Icon } from "src/imports/components"
import { unsetUser} from "src/store/actions";

const Navigation = (props) => {
  return (
    <nav>
      <BottomLinks>
        <BottomLink to="/dashboard">
          <Icon name="home" />
        </BottomLink>
        <BottomLink to="/exercises">
          <Icon name="gymnast" />
        </BottomLink>
        {/* <BottomLink to="/cardio">
          <Icon name="cardiogram" />
        </BottomLink> */}
        <BottomLink to="/workouts">
          <Icon name="menu" />
        </BottomLink>
        <BottomLink to="/users">
          <Icon name="user" />
        </BottomLink>
        <BottomLink to="/settings">
          <Icon name="settings" />
        </BottomLink>
        <BottomLink to="/login" onClick={props.unsetUser}>
          <Icon name="login" />
        </BottomLink>
      </BottomLinks>
    </nav>
  );
};

// Styles

const BottomLinks = styled.ul`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: red;
  color: blue;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.466);
  display: flex;
  justify-content: space-between;
  max-width: 450px;
  z-index: 1000;
  padding: 0;
  margin: 0;
  list-style: none;

  background-color: ${colors.secondary};
`;

const BottomLink = styled(Link)`
  padding: 1rem 0;
  text-align: center;
  text-decoration: none;
  width: 20%;
  font-size: 16px;
  font-weight: 600;
  color: ${colors.faded};
  &.active {
    color: ${colors.headers};
  }
`;

const mapDispatchToProps = (dispatch) => {
  return {
    unsetUser: () => dispatch(unsetUser()),
  };
};

export default connect(null, mapDispatchToProps)(Navigation);
