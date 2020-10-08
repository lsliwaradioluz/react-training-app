import { React, styled, NavLink } from "src/imports/react";

const Slide = (props) => {
  return (
    <$SlideWrapper>
      <$Slide image={props.slide.image}>
        <$SlideHeader>{props.slide.title}</$SlideHeader>
        <$SlideCaption>{props.slide.caption}</$SlideCaption>
        <$SlideButton to={props.slide.link}>Wejdź</$SlideButton>
      </$Slide>
    </$SlideWrapper>
  );
};

const $SlideWrapper = styled.div`
  padding: 0 1rem 1rem 0;
  &:last-child {
    padding-right: 0;
  }
`;

const $Slide = styled.div`
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.7)),
    url("${(props) => props.image}") center;
  background-size: cover;
  padding: 1rem;
  height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
`;

const $SlideHeader = styled.h3`
  margin: 0;
  font-weight: 500;
  color: white;
`;

const $SlideCaption = styled.p`
  margin: 0;
  font-size: 13px;
  color: white;
  opacity: white;
`;

const $SlideButton = styled(NavLink)`
  border: 1px solid white;
  margin-top: 0.5rem;
  padding: 0.5rem 1.5rem;
  transition: all 0.3s linear;
  &:hover {
    background-color: white;
    color: black;
  }
`;

export default Slide;
