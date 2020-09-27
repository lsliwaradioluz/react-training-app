import { React, styled, colors, NavLink } from "src/imports/react";
import { Icon as icon } from "src/imports/components";

const FamilyTab = (props) => {
  const familyDescription = () => {
    let exerciseDeclination;
    const numberOfExercises = props.family.exercises.length;

    if (numberOfExercises === 1) {
      exerciseDeclination = "ćwiczenie";
    } else if ([2, 3, 4].includes(numberOfExercises)) {
      exerciseDeclination = "ćwiczenia";
    } else {
      exerciseDeclination = "ćwiczeń";
    }

    return `Kategoria | ${numberOfExercises} ${exerciseDeclination}`;
  };

  return (
    <$FamilyTab to={`${props.pathname}/${props.family.id}`}>
      <div>
        <$TabName>{props.family.name}</$TabName>
        <$TabCaption>{familyDescription()}</$TabCaption>
      </div>
      <Icon name="right-arrow" />
    </$FamilyTab>
  );
};

const $FamilyTab = styled(NavLink)`
  display: block;
  padding: 0.5rem 0 !important;
  text-decoration: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const $TabName = styled.h4`
  color: white;
  margin: 0;
`;

const $TabCaption = styled.p`
  color: ${colors.faded};
  font-size: 13px;
  margin-bottom: 0;
`;

const Icon = styled(icon)`
  color: ${colors.headers}
`

export default FamilyTab;
