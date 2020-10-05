import {
  React,
  styled,
  connect,
  apolloClient,
  cloneDeep,
  colors,
} from "src/imports/react";
import { Button } from "src/imports/components";
import { CREATE_WORKOUT, UPDATE_WORKOUT, GET_USER } from "src/imports/apollo";
import { setNotification, addEntryToDB } from "src/store/actions";
import removeTypename from "src/utils/removeTypename";

const Buttons = (props) => {
  const filteredSections = props.workout.sections.filter(
    (section) => section.complexes.length > 0
  );
  const dateAndTime = new Date(
    props.workout.selectedDate + " " + props.workout.selectedTime
  );

  const saveWorkout = async () => {
    if (filteredSections.length === 0) {
      props.setNotification("Musisz dodać ćwiczenia, aby móc zapisać trening!");
      return;
    }
    let configObj;
    const input = {
      scheduled: dateAndTime,
      sticky: props.workout.sticky,
      name: props.workout.name,
      ready: filteredSections.length > 0,
      sections: removeTypename(filteredSections),
    };

    if (props.workout.id) {
      input.id = props.workout.id;
      configObj = {
        mutation: UPDATE_WORKOUT,
        variables: { input },
      };
    } else {
      input.user = props.userId;
      configObj = {
        mutation: CREATE_WORKOUT,
        variables: { input },
        update: (cache, { data: { createWorkout } }) => {
          const data = cloneDeep(
            cache.readQuery({
              query: GET_USER,
              variables: { id: props.userId },
            })
          );
          data.user.workouts.unshift(createWorkout);
          apolloClient.writeQuery({
            query: GET_USER,
            variables: { id: props.userId },
            data,
          });
        },
      };
    }

    try {
      const { data } = await apolloClient.mutate(configObj);
      if (props.workoutToPair && props.workoutToPair.id === data.updateWorkout.id) {
        props.addEntryToDB("workoutToPair", {
          ...data.updateWorkout,
          user: props.workoutToPair.user,
        });
      }
      props.goBack();
    } catch (err) {
      console.log(err);
      props.setNotification("Coś poszło nie tak. Spróbuj jeszcze raz");
    }
  };

  return (
    <$Buttons>
      <Button click={saveWorkout}>Zapisz</Button>
      <Button click={props.goBack}>Anuluj</Button>
    </$Buttons>
  );
};

const $Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    flex-basis: 49%;
  }
`;

const mapStateToProps = (state) => {
  return {
    workoutToPair: state.workoutToPair,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
    addEntryToDB: (key, entry) => dispatch(addEntryToDB(key, entry)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Buttons);
