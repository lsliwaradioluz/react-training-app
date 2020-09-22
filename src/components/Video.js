import { React, styled } from "src/imports/react";

const Video = (props) => {
  return (
    <$Video opacity={props.opacity}>
      <$Element autoPlay loop muted playsInline>
        <source src={props.source} type="video/webm" />
        <source src={props.source} type="video/mp4" />
      </$Element>
    </$Video>
  )
};

const $Video = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  &:after {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(
      0,
      0,
      0,
      ${(props) => (props.opacity ? props.opacity : "0.2")}
    );
  }
`;

const $Element = styled.video`
  position: absolute;
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

export default Video;
