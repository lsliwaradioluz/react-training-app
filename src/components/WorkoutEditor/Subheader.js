import { React, styled, colors } from "src/imports/react";

const Subheader = (props) => {
  return <$Subheader>{props.children}</$Subheader>;
};

const $Subheader = styled.h4`
  color: ${colors.faded};
  margin: 1rem 0 0.5rem 0;
  display: flex;
  justify-content: space-between;
  button {
    font-size: 18px;
  }
`;

export default Subheader;
