import { React, styled, colors } from "src/imports/react";
import Avatar from "src/components/Avatar";

const UserPanel = (props) => {
  const role = props.user.admin ? "Trener" : "Podopieczny";
  return (
    <$UserPanel>
      <Avatar source={props.user.image && props.user.image.url} />
      <$UserName>{props.user.fullname}</$UserName>
      <$UserRole>{role}</$UserRole>
    </$UserPanel>
  );
};

const $UserPanel = styled.div`
  display: none;
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
  }
`;

const $UserName = styled.h3`
  color: ${colors.headers};
  margin-top: 1rem;
  margin-bottom: 0;
`;

const $UserRole = styled.p`
  font-size: 14px;
`;

export default UserPanel;
