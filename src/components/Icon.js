import { React, styled } from "src/imports/react";

const Icon = (props) => {
  return (
    <$Icon
      className={`flaticon-${props.name} ${props.className}`}
    ></$Icon>
  );
};

const $Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: inherit;
`;

export default Icon;
