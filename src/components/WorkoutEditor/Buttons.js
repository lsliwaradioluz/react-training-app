import { React, styled, colors } from "src/imports/react";
import { Button } from "src/imports/components";

const Buttons = (props) => {
  return (
    <$Buttons>
      <Button>Zapisz</Button>
      <Button click={props.goBack}>Anuluj</Button>
    </$Buttons>
  );
};

const $Buttons = styled.div`
  display: flex;
  position: fixed;
  justify-content: space-between;
  bottom :0;
  left: 0;
  width: 100%;
  padding: 0 1rem;
  button {
    flex-basis: 49%;
  }
`

export default Buttons;
