import { React, styled, colors } from "src/imports/react";

const Button = (props) => {
  return (
    <Btn onClick={props.click} className={props.className}>
      {props.children}
    </Btn>
  );
};

// Styles
const Btn = styled.button`
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
    color: ${colors.inputgray};
  }
`;

export default Button;
