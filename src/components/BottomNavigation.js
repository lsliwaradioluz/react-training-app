import {
  React,
  styled,
  NavLink as Link,
  colors,
  connect,
} from "src/imports/react";
import { Icon } from "src/imports/components";
import UserPanel from "src/components/BottomNavigation/UserPanel";
import { unsetUser } from "src/store/actions";

export const BottomNavigation = (props) => {
  let nav = null

  if (props.user) {
    nav = (
      <nav>
        <$BottomLinks>
          {props.user ? <UserPanel user={props.user} /> : null}
          <$BottomLink to="/dashboard">
            <Icon name="home" />
            <$Caption>Instrukcje</$Caption>
          </$BottomLink>
          <$BottomLink to="/exercises">
            <Icon name="gymnast" />
            <$Caption>Ćwiczenia</$Caption>
          </$BottomLink>
          <$BottomLink to="/cardio">
            <Icon name="cardiogram" />
          </$BottomLink>
          <$BottomLink to="/workouts">
            <Icon name="menu" />
            <$Caption>Treningi</$Caption>
          </$BottomLink>
          {props.user.admin ? (
            <$BottomLink to="/users">
              <Icon name="user" />
              <$Caption>Podopieczni</$Caption>
            </$BottomLink>
          ) : null}
          <$BottomLink to="/settings">
            <Icon name="settings" />
            <$Caption>Ustawienia</$Caption>
          </$BottomLink>
          <$BottomLink to="/login" onClick={props.unsetUser}>
            <Icon name="login" />
            <$Caption>Wyloguj</$Caption>
          </$BottomLink>
        </$BottomLinks>
      </nav>
    )
  }
  return nav
};

// Styles

export const $BottomLinks = styled.ul`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.466);
  display: flex;
  justify-content: space-between;
  z-index: 1004;
  padding: 0;
  margin: 0;
  list-style: none;
  background-color: ${colors.secondary};
  @media (min-width: 1024px) {
    position: static;
    flex-direction: column;
    justify-content: flex-start;
    height: 100%;
    width: auto;
    padding: 2.5rem 6rem 2rem 2rem;
  }
`;

export const $BottomLink = styled(Link)`
  padding: 1rem 0;
  text-align: center;
  text-decoration: none;
  width: 20%;
  font-size: 16px;
  font-weight: 600;
  color: ${colors.faded};
  transition: color 0.3s linear;
  &.active {
    color: ${colors.headers};
  }
  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
    font-size: 20px;
    &:hover {
      opacity: 0.7;
    }
  }
`;

const $Caption = styled.p`
  display: none;
  @media (min-width: 1024px) {
    display: block;
    margin: 0;
    margin-left: 1rem;
    font-size: 20px;
  }
`;

const mapStateToProps = (state) => {
  return {
    user: state.main.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    unsetUser: () => dispatch(unsetUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(BottomNavigation);
