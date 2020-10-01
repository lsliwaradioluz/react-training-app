import {
  React,
  styled,
  filters,
  colors,
  NavLink,
  connect,
  apolloClient,
  cloneDeep,
  withRouter,
} from "src/imports/react";
import { DELETE_WORKOUT, GET_USER } from "src/imports/apollo";
import { Icon, ContextMenu } from "src/imports/components";

const WorkoutTab = (props) => {
  const deleteWorkout = async () => {
    await apolloClient.mutate({
      mutation: DELETE_WORKOUT,
      variables: { id: props.workout.id },
      update: (cache, { data: { deleteWorkout } }) => {
        try {
          const data = cloneDeep(
            cache.readQuery({
              query: GET_USER,
              variables: { id: props.match.params.id },
            })
          );
          data.user.workouts = data.user.workouts.filter(
            (workout) => workout.id !== deleteWorkout.id
          );
          apolloClient.writeQuery({
            query: GET_USER,
            variables: { id: props.match.params.id },
            data,
          });
        } catch (err) {
          console.log(err);
        }
      },
    });
    props.onWorkoutDelete()
  };

  const renderContextMenu = () => {
    if (props.user.admin) {
      return (
        <$ContextMenu
          buttons={[
            { caption: "Usuń", icon: "trash", callback: deleteWorkout },
          ]}
        />
      );
    } else {
      return <$Icon name="right-arrow" active={props.workout.ready} />;
    }
  };

  return (
    <$WorkoutTab>
      <$WorkoutData to={`/workouts/${props.workout.id}`}>
        <$Date>{filters.reverseDate(props.workout.scheduled)}</$Date>
        <$DayAndTime>
          {filters.getDayName(props.workout.scheduled)}{" "}
          {filters.getTime(props.workout.scheduled)}
        </$DayAndTime>
      </$WorkoutData>
      {renderContextMenu()}
    </$WorkoutTab>
  );
};

const $WorkoutTab = styled.div`
  padding: 0.5rem 0;
  position: relative;
  display: flex;
  justify-content: space-between;
`;

const $WorkoutData = styled(NavLink)`
  width: 100%;
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
  color: ${(props) => (props.active ? colors.headers : colors.faded)};
  font-size: 18px;
`;

const $ContextMenu = styled(ContextMenu)`
  color: ${colors.headers};
`;

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(withRouter(WorkoutTab));
