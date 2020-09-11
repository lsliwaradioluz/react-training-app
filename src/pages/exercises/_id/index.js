import {
  React,
  Component,
  styled,
  apolloClient,
  colors,
  Fragment,
  css,
} from "src/imports/react";
import ExerciseLayout from "src/layouts/Exercise";
import { Placeholder, Video } from "src/imports/components";
import { GET_FAMILY } from "src/imports/apollo";

class ExercisePage extends Component {
  state = {
    family: null,
    currentExercise: 0,
  };

  async componentDidMount() {
    const { data } = await apolloClient.query({
      query: GET_FAMILY,
      variables: {
        id: this.props.match.params.id,
      },
    });

    this.setState({ family: data.family });
  }

  setCurrentExercise = (newIndex) => {
    this.setState({ currentExercise: newIndex });
  };

  getCurrentExercise = () => {
    return this.state.family.exercises[this.state.currentExercise];
  };

  getFamilyCaption = () => {
    let exerciseDeclination;
    const numberOfExercises = this.state.family.exercises.length;

    if (numberOfExercises === 1) {
      exerciseDeclination = "ćwiczenie";
    } else if ([2, 3, 4].includes(numberOfExercises)) {
      exerciseDeclination = "ćwiczenia";
    } else {
      exerciseDeclination = "ćwiczeń";
    }

    return `Kategoria | ${numberOfExercises} ${exerciseDeclination}`;
  };

  render() {
    let elements = <Placeholder />;
    if (this.state.family) {
      let buttons = <p>Ta kategoria nie ma jeszcze żadnego ćwiczenia</p>;
      if (this.state.family.exercises.length > 0) {
        buttons = (
          <SwitchExerciseButtons>
            {this.state.family.exercises.map((exercise, index) => (
              <SwitchExerciseButton
                key={index}
                onClick={this.setCurrentExercise.bind(this, index)}
                active={index === this.state.currentExercise}
              >
                {index + 1}
              </SwitchExerciseButton>
            ))}
          </SwitchExerciseButtons>
        );
      }

      elements = (
        <Fragment>
          <Exercise>
            <Video
              source={this.getCurrentExercise().image.url}
              key={`image-${this.state.currentExercise}${this.state.family.exercises.length}`}
            />
            <Name>{this.getCurrentExercise().name}</Name>
          </Exercise>
          <Family>
            <Name color={colors.headers}>{this.state.family.name}</Name>
            <Caption>{this.getFamilyCaption()}</Caption>
            {buttons}
          </Family>
        </Fragment>
      );
    }

    return (
      <ExerciseLayout>
        <Container>{elements}</Container>
      </ExerciseLayout>
    );
  }
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Exercise = styled.div`
  position: relative;
  flex-basis: 90%;
  flex-shrink: 1;
  border-bottom: 2px solid ${colors.headers};
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1rem;
  background-color: black;
`;

const Family = styled.div`
  padding: 1rem;
`;

const Name = styled.h3`
  color: ${(props) => (props.color ? props.color : "white")};
  margin: 0;
  display: flex;
  justify-content: space-between;
  z-index: 4;
`;

const Caption = styled.p`
  margin: 0;
  color: ${colors.faded};
  font-size: 12px;
`;

const SwitchExerciseButtons = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding-top: 0.5rem;
`;

const activeButton = css`
  background-color: ${colors.headers};
  border-color: ${colors.headers};
  color: ${colors.primary};
`

const SwitchExerciseButton = styled.li`
  height: 25px;
  width: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 50%;
  border: 1px solid white;
  margin-right: 5px;
  margin-bottom: 5px;
  transition: background-color 0.3s;
  font-size: 13px;
  ${props => props.active ? activeButton : null}
`;

// .family {
//   height: 100vh;
// }

// .family__main {
//   height: 100%;
//   display: flex;
//   flex-direction: column;
// }

// .family__exercise {
//   position: relative;
//   flex-basis: 90%;
//   flex-shrink: 1;
//   border-bottom: 2px solid color(headers);
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-end;
//   padding: 1rem;
// }

// .family__exercise__name {
//   color: white !important;
//   margin: 0;
//   display: flex;
//   justify-content: space-between;
//   z-index: 4;
// }

// .family__details__name {
//   margin: 0;
//   display: flex;
//   justify-content: space-between;
// }

// .family__details__button {
//   display: flex;
//   align-items: center;
//   animation: pulse 1s infinite;
// }

// .family__details__caption {
//   margin: 0;
//   color: color(faded);
//   font-size: 12px;
// }

// .family__details__exercises {
//   display: flex;
//   flex-wrap: wrap;
//   padding-top: 0.5rem;
// }

// .family__details__exercise {
//   height: 25px;
//   width: 25px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   padding: 0;
//   border-radius: 50%;
//   border: 1px solid white;
//   margin-right: 5px;
//   margin-bottom: 5px;
//   transition: background-color 0.3s;
//   font-size: 13px;
// }

// .family__details__exercise--active {
//   background-color: color(headers);
//   border-color: color(headers);
//   color: color(primary);
// }

export default ExercisePage;
