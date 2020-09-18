import { React, styled, filters, colors, NavLink } from "src/imports/react";
import { Icon } from "src/imports/components";

const WorkoutTab = (props) => {
  return (
    <$WorkoutTab to={`/workouts/${props.workout.id}`}>
      <$Date>{filters.reverseDate(props.workout.scheduled)}</$Date>
      <$DayAndTime>
        {filters.getDayName(props.workout.scheduled)}{" "}
        {filters.getTime(props.workout.scheduled)}
      </$DayAndTime>
      <$Icon name="right-arrow" active={props.workout.ready} />
    </$WorkoutTab>
  );
};

const $WorkoutTab = styled(NavLink)`
  padding: 0.5rem 0;
  position: relative;
`;

const $Date = styled.h4`
  margin-bottom: 0;
`;

const $DayAndTime = styled.p`
  color: ${colors.faded};
  font-size: 13px;
  margin-bottom: 0;
`;

const $Icon = styled(Icon)`
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  color: ${props => props.active ? colors.headers : colors.faded };
  font-size: 18px;
`

export default WorkoutTab;
