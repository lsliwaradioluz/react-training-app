import { React, useQuery } from "src/imports/react";
import { GET_EXERCISE } from "src/imports/apollo";
import { Header, Placeholder } from "src/imports/components";
import ExerciseEditor from "src/components/ExerciseEditor";
import DefaultLayout from "src/layouts/Default";

const EditExercisePage = (props) => {
  const exerciseID = props.location.state.exercise;
  const { data } = useQuery(GET_EXERCISE, { variables: { id: exerciseID } });
  
  if (data) {
    return (
      <DefaultLayout>
        <Header>Edytuj ćwiczenie</Header>
        <ExerciseEditor exercise={data.exercise} />
      </DefaultLayout>
    )
  }

  return (
    <DefaultLayout>
      <Placeholder />
    </DefaultLayout>
  );
};

export default EditExercisePage;
