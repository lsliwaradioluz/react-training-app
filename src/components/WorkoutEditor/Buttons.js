import { React, styled, connect, apolloClient, cloneDeep } from "src/imports/react";
import { Button } from "src/imports/components";
import { CREATE_WORKOUT, UPDATE_WORKOUT, GET_USER } from "src/imports/apollo";
import { setNotification } from "src/store/actions";
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
      await apolloClient.mutate(configObj);
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
  position: fixed;
  justify-content: space-between;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 0 1rem;
  button {
    flex-basis: 49%;
  }
`;

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(null, mapDispatchToProps)(Buttons);
