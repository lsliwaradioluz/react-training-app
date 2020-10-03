import {
  React,
  styled,
  NavLink as Link,
  colors,
  connect,
} from "src/imports/react";
import { Icon } from "src/imports/components";
import { unsetUser } from "src/store/actions";

const Navigation = (props) => {
  return (
    <nav>
      <$BottomLinks>
        <$BottomLink to="/dashboard">
          <Icon name="home" />
          <$Caption>Instrukcje</$Caption>
        </$BottomLink>
        <$BottomLink to="/exercises">
          <Icon name="gymnast" />
          <$Caption>Ćwiczenia</$Caption>
        </$BottomLink>
        {/* <$BottomLink to="/cardio">
          <Icon name="cardiogram" />
        </$BottomLink> */}
        <$BottomLink to="/workouts">
          <Icon name="menu" />
          <$Caption>Treningi</$Caption>
        </$BottomLink>
        <$BottomLink to="/users">
          <Icon name="user" />
          <$Caption>Podopieczni</$Caption>
        </$BottomLink>
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
  );
};

// Styles

const $BottomLinks = styled.ul`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  color: blue;
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
    padding: 1rem 6rem 2rem 2rem;
  }
`;

const $BottomLink = styled(Link)`
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
      opacity: .7;
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

const mapDispatchToProps = (dispatch) => {
  return {
    unsetUser: () => dispatch(unsetUser()),
  };
};

export default connect(null, mapDispatchToProps)(Navigation);
