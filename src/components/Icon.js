import { React, styled } from "src/imports/react";

const Icon = (props) => {
  return (
    <Icn
      className={`flaticon-${props.name} ${props.className}`}
    ></Icn>
  );
};

const Icn = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: initial;
`;

export default Icon;
