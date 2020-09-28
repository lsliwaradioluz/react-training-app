import { React, styled, colors } from "src/imports/react";

const Checkbox = (props) => {
  return (
    <$Checkbox>
      <$Label>{props.label}</$Label>
      <$Input
        value={props.value}
        checked={props.value}
        type="checkbox"
        onChange={props.onChange}
      />
    </$Checkbox>
  );
};

const $Checkbox = styled.div`
  position: relative;
  margin-bottom: 1rem;
  transition: margin 0.3s;
  color: ${colors.headers};
  display: flex;
  align-items: flex-end;
`;

const $Label = styled.label`
  position: absolute;
  top: -4px;
  font-weight: 500;
  font-size: 10px;
  color: ${colors.faded};
`;

const $Input = styled.input`
  box-sizing: content-box;
  margin-left: 0;
  appearance: none;
  height: 20px;
  width: 40px;
  border: 2px solid ${colors.headers};
  border-radius: 15px;
  transition: all 0.5s;
  position: relative;
  outline: none;
  &::after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 20px;
    width: 20px;
    background-color: white;
    border-radius: 50%;
    transition: left 0.3s;
  }
  &:checked {
    background-color: ${colors.headers};
    &::after {
      left: 20px;
    }
  }
`;

export default Checkbox;
