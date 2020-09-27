import { React, styled, colors } from "src/imports/react";
import defaultAvatar from "../assets/images/person.svg";

const Avatar = (props) => {
  let source = defaultAvatar;
  if (props.url) {
    source = props.url;
  }
  return (
    <$Avatar
      src={source}
      alt="avatar"
      height={props.height}
      width={props.width}
      className={props.className}
    />
  );
};

const $Avatar = styled.img`
  height: ${(props) => props.height || 160}px;
  width: ${(props) => props.width || 160}px;
  object-fit: cover;
  background-color: ${colors.secondary};
  box-shadow: 0 15px 30px 0 rgba(0,0,0,.21), 0 0 15px 0 rgba(0,0,0,.18);
`;

export default Avatar;
