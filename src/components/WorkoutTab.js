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
import { addEntryToDB } from "src/store/actions";

const WorkoutTab = (props) => {
  const workoutName = props.workout.sticky
    ? props.workout.name
    : filters.reverseDate(props.workout.scheduled);

  const workoutScheduled = props.workout.sticky
    ? `dodano ${filters.reverseDate(props.workout.scheduled)}`
    : `${filters.getDayName(props.workout.scheduled)} ${filters.getTime(
        props.workout.scheduled
      )}`;

  const copyPairWorkout = (key) => {
    const workout = cloneDeep(props.workout);
    workout.user = {
      id: props.user.id,
      username: props.user.username,
      fullname: props.user.fullname,
    };

    props.addEntryToDB(key, workout);
    props.history.push('/users')
  };

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
    props.onWorkoutDelete();
  };

  const renderContextMenu = () => {
    if (props.isCoach && !props.location.pathname.includes("workouts")) {
      return (
        <$ContextMenu
          buttons={[
            {
              caption: "Edytuj",
              icon: "pencil",
              link: {
                pathname: `/workouts/${props.workout.id}/edit`,
                state: { userID: props.user.id },
              },
            },
            {
              caption: "Paruj",
              icon: "double-arrow-cross-of-shuffle",
              callback: copyPairWorkout.bind(this, "workoutToPair"),
            },
            {
              caption: "Kopiuj",
              icon: "copy",
              callback: copyPairWorkout.bind(this, "workoutToCopy"),
            },
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
        <$WorkoutName>{workoutName}</$WorkoutName>
        <$WorkoutScheduled>{workoutScheduled}</$WorkoutScheduled>
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
  align-items: center;
`;

const $WorkoutData = styled(NavLink)`
  width: 100%;
`;

const $WorkoutName = styled.h4`
  margin-bottom: 0;
`;

const $WorkoutScheduled = styled.p`
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
    isCoach: state.main.user.admin,
    workoutToPair: state.workouts.workoutToPair,
    workoutToCopy: state.workouts.workoutToCopy, 
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addEntryToDB: (key, entry) => dispatch(addEntryToDB(key, entry)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(WorkoutTab));
