import { React, styled, colors, css, NavLink } from "src/imports/react";

const Button = (props) => {
  let button;
  if (props.to) {
    button = (
      <$ButtonLink
        to={props.to}
        className={props.className}
        theme={props.theme}
        active={props.active}
      >
        {props.children}
      </$ButtonLink>
    );
  } else {
    button = (
      <$Button
        onClick={props.click}
        className={props.className}
        type="button"
        theme={props.theme}
        active={props.active}
        disabled={props.disabled}
      >
        {props.children}
      </$Button>
    );
  }
  return button;
};

const secondaryStyles = css`
  background-color: transparent;
  color: ${colors.headers};
  border: 1px solid ${colors.headers};
  font-weight: 400;
`;

const tertiaryStyles = css`
  border-color: white;
  color: white;
`;

const switchStyles = css`
  border-bottom: 1px solid ${colors.faded};
  border-radius: 0;
  box-shadow: none;
  color: ${colors.faded};
  flex-basis: 100%;
  flex-shrink: 1;
  padding-bottom: 0.4rem;
  transition: all 0.3s;
  font-size: 14px;
  font-family: "Roboto Condensed", sans-serif;
  background-color: transparent;
  margin: .5rem 0;
`;

const switchActiveStyles = css`
  color: ${colors.headers} !important;
  border-bottom: 1px solid ${colors.headers} !important;
`;

const finalStyles = css`
  border: none;
  border-radius: 6px;
  outline: none;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.226);
  position: relative;
  white-space: nowrap;
  cursor: pointer;
  background-color: ${colors.headers};
  color: ${colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400;
  font-family: "Roboto Condensed", sans-serif;
  font-size: 14px;
  line-height: 1.5;
  padding: 0.5rem 1.5rem;
  margin: 1rem 0;
  transition: all 0.3s;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  ${(props) =>
    props.theme === "secondary" || props.theme === "tertiary"
      ? secondaryStyles
      : null}
  ${(props) =>
    props.theme !== "secondary" && props.theme === "tertiary"
      ? tertiaryStyles
      : null}
  ${(props) =>
    props.theme === "switch" ? switchStyles : null}
  ${(props) =>
    props.active ? switchActiveStyles : null}
`;

const $Button = styled.button`
  ${finalStyles}
`;

const $ButtonLink = styled(NavLink)`
  ${finalStyles}
`;

export default Button;
