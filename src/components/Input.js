import { React, colors, styled, transition } from "src/imports/react";
import { Icon } from "src/imports/components";

const Input = (props) => {
  let icon = null;
  let deleteButton = null;

  const inputRef = React.createRef();

  const clearInput = () => {
    inputRef.current.value = "";
    const event = {
      target: inputRef.current,
    };
    props.onChange(event);
  };

  if (props.search) {
    icon = <$Icon name="search" color={colors.faded} />;
  }
  if (props.showDeleteButton) {
    deleteButton = (
      <$DeleteButton type="button" onClick={clearInput}>
        <Icon name="cancel" />
      </$DeleteButton>
    );
  }
  
  return (
    <$InputContainer className={props.className}>
      <$Label
        in={Boolean(props.value) && props.value.length > 0 && !props.hideLabel}
        timeout={500}
        unmountOnExit
      >
        {props.placeholder}
      </$Label>
      {icon}
      {deleteButton}
      <$Input
        ref={inputRef}
        disabled={props.disabled}
        placeholder={props.placeholder}
        type={props.type}
        onChange={props.onChange}
        value={props.value}
        spellCheck={props.spellcheck ? props.spellcheck : false}
        search={props.search}
      />
    </$InputContainer>
  );
};

const $InputContainer = styled.div`
  position: relative;
  margin-bottom: 1rem;
  transition: margin 0.3s;
`;

const $Label = transition.label`
  position: absolute;
  top: -3px;
  font-weight: 500;
  font-size: 10px;
  color: ${colors.faded};
  transition: all .5s;
  &:enter {
    opacity: 0;
    transform: translateX(100px);
  }
  &:enter-active {
    opacity: 1;
    transform: translateX(0);
  }
  &:exit-active {
    transform: translateX(100px);
    opacity: 0;
  }
`;

const $Icon = styled(Icon)`
  position: absolute;
  bottom: 7px;
  color: ${colors.faded};
  font-size: 12px;
`;

const $Input = styled.input`
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
  input[type="date"]::-webkit-inner-spin-button,
  input[type="date"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
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
  &:disabled {
    opacity: 0.3;
  }
`;

const $DeleteButton = styled.button`
  position: absolute;
  right: 0;
  font-size: 8px;
  bottom: 7px;
  right: 4px;
  margin-left: 4px;
`;

export default Input;
