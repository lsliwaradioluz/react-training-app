import { React, colors, styled } from "src/imports/react";
import { Icon as icon } from "src/imports/components";

const Input = (props) => {
  let label = null;
  let icon = null;
  if (props.value && !props.hideLabel) {
    label = <$Label>{props.placeholder}</$Label>;
  }
  if (props.search) {
    icon = <$Icon name="search" color={colors.faded} />;
  }

  const renderOptions = () => {
    const options = props.options.map((option, index) => (
      <$Option key={index} value={option.value}>
        {option.name}
      </$Option>
    ));
    if (!props.value) {
      options.unshift(<$EmptyOption key="blank-option" />);
    }
    return options;
  };

  return (
    <$SelectContainer>
      {label}
      {icon}
      {props.value ? null : <$Placeholder>{props.placeholder}</$Placeholder>}
      <$Select onChange={props.onChange} value={props.value}>
        {renderOptions()}
      </$Select>
    </$SelectContainer>
  );
};

const $SelectContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
  transition: margin 0.3s;
`;

const $Label = styled.label`
  position: absolute;
  top: -3px;
  font-weight: 500;
  font-size: 10px;
  color: ${colors.faded};
`;

const $Icon = styled(icon)`
  position: absolute;
  bottom: 7px;
  color: ${colors.faded};
  font-size: 12px;
`;

const $Select = styled.select`
  outline: none;
  border: none;
  font-family: inherit;
  font-weight: inherit;
  font-size: inherit;
  color: inherit;
  display: block;
  width: 100%;
  resize: none;
  background-color: transparent;
  display: block;
  width: 100%;
  padding: 1rem 1rem 0 ${(props) => (props.search ? "1rem" : "0")};
  font-size: 14px;
  height: 45px;
  transition: all 0.25s ease;
  color: ${colors.text};
  border-bottom: 1px solid ${colors.faded};
  -webkit-appearance: none;
  -moz-appearance: none;
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-transition-delay: 9999s;
    transition-delay: 9999s;
  }
  &:focus {
    border-bottom: 1px solid ${colors.headers};
  }
  &::placeholder {
    color: ${colors.faded};
  }
`;

const $Placeholder = styled.p`
  position: absolute;
  left: 0;
  bottom: 4px;
  margin: 0;
  color: ${colors.faded};
`;

const $Option = styled.option`
  color: white;
  border: none;
  background-color: ${colors.secondary};
  padding-left: 0.5rem;
  &:disabled {
    color: ${colors.faded};
  }
`;

const $EmptyOption = styled.option`
  display: none;
`;

export default Input;
