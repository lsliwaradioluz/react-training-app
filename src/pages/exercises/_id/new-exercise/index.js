import {React} from "src/imports/react"
import {Header} from "src/imports/components"
import ExerciseEditor from "src/components/ExerciseEditor"
import DefaultLayout from "src/layouts/Default";

const NewExercisePage = props => {
  return (
    <DefaultLayout>
      <Header>Nowe ćwiczenie</Header>
      <ExerciseEditor />
    </DefaultLayout>
  )
}

export default NewExercisePage