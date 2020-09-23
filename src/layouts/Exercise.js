import { React, styled, colors } from "src/imports/react"
import TopNavigation from "src/components/TopNavigation"

const ExerciseLayout = (props) => {
  return (
    <ExerciseLout>
      <TopNavigation color="white" />
      {props.children}
    </ExerciseLout>
  )
}

const ExerciseLout = styled.main`
  min-height: 100vh;
  background-color: ${colors.primary};
  color: white;
  display: flex;
  flex-direction: column;
`

export default ExerciseLayout