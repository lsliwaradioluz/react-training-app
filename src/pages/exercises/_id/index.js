import {
  React,
  Component,
  styled,
  apolloClient,
  colors,
  Fragment,
  css,
  connect,
  cloneDeep,
} from "src/imports/react";
import { setNotification } from "src/store/actions";
import ExerciseLayout from "src/layouts/Exercise";
import { Placeholder, Video, ContextMenu } from "src/imports/components";
import { GET_FAMILY, DELETE_FAMILY, GET_FAMILIES } from "src/imports/apollo";

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

  deleteFamily = async () => {
    if (this.state.family.exercises.length > 0) {
      this.props.setNotification(
        "Usunięcie kategorii jest możliwe tylko wtedy, gdy nie zawiera żadnych ćwiczeń"
      );
      return;
    }

    try {
      await apolloClient.mutate({
        mutation: DELETE_FAMILY,
        variables: { id: this.state.family.id },
        update: (cache, { data: { deleteFamily } }) => {
          try {
            const data = cloneDeep(
              cache.readQuery({
                query: GET_FAMILIES,
                variables: { userId: this.props.userID },
              })
            );

            cache.writeQuery({
              query: GET_FAMILIES,
              variables: { userId: this.props.userID },
              data: {
                families: data.families.filter(
                  (family) => family.id !== deleteFamily.id
                ),
              },
            });
          } catch (err) {
            if (err.message !== "Cannot read property 'families' of null") {
              this.props.setNotification(
                "Nie udało się wykonać operacji. Sprawdź połączenie z Internetem"
              );
            }
          }
        },
      });
      this.props.setNotification("Kategoria usunięta pomyślnie!");
      this.props.history.goBack();
    } catch {
      this.props.setNotification(
        "Nie udało się wykonać operacji. Sprawdź połączenie z Internetem"
      );
    }
  };

  render() {
    let elements = <Placeholder />;

    if (this.state.family) {
      let buttons = (
        <$Paragraph>Ta kategoria nie ma jeszcze żadnego ćwiczenia</$Paragraph>
      );
      let exercise = (
        <$Exercise>
          <Video source="https://res.cloudinary.com/drsgb4wld/image/upload/v1594649581/GIF-200713_160448_03e89fc155.mp4" />
        </$Exercise>
      );
      if (this.state.family.exercises.length > 0) {
        exercise = (
          <$Exercise>
            <Video
              source={
                this.getCurrentExercise().image
                  ? this.getCurrentExercise().image.url
                  : "https://res.cloudinary.com/drsgb4wld/image/upload/v1594649581/GIF-200713_160448_03e89fc155.mp4"
              }
              key={`image-${this.state.currentExercise}${this.state.family.exercises.length}`}
            />
            <$Name>
              {this.getCurrentExercise().name}
              <ContextMenu
                buttons={[
                  { caption: "Edytuj ćwiczenie", icon: "pencil" },
                  { caption: "Usuń ćwiczenie", icon: "trash" },
                ]}
              />
            </$Name>
          </$Exercise>
        );
        buttons = (
          <$SwitchExerciseButtons>
            {this.state.family.exercises.map((exercise, index) => (
              <$SwitchExerciseButton
                key={index}
                onClick={this.setCurrentExercise.bind(this, index)}
                active={index === this.state.currentExercise}
              >
                {index + 1}
              </$SwitchExerciseButton>
            ))}
          </$SwitchExerciseButtons>
        );
      }

      elements = (
        <Fragment>
          {exercise}
          <$Family>
            <$Name color={colors.headers}>
              {this.state.family.name}
              <ContextMenu
                buttons={[
                  {
                    caption: "Dodaj ćwiczenie",
                    icon: "add-button",
                  },
                  {
                    caption: "Edytuj kategorię",
                    icon: "pencil",
                    link: `/exercises/${this.state.family.id}/edit-family`
                  },
                  {
                    caption: "Usuń kategorię",
                    icon: "trash",
                    callback: this.deleteFamily,
                  },
                ]}
              />
            </$Name>
            <$Caption>{this.getFamilyCaption()}</$Caption>
            {buttons}
          </$Family>
        </Fragment>
      );
    }

    return (
      <ExerciseLayout>
        <$ExercisePage>{elements}</$ExercisePage>
      </ExerciseLayout>
    );
  }
}

const $ExercisePage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const $Exercise = styled.div`
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

const $Family = styled.div`
  padding: 1rem;
`;

const $Name = styled.h3`
  color: ${(props) => (props.color ? props.color : "white")};
  margin: 0;
  display: flex;
  justify-content: space-between;
  z-index: 4;
`;

const $Caption = styled.p`
  margin: 0;
  color: ${colors.faded};
  font-size: 12px;
`;

const $SwitchExerciseButtons = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding-top: 0.5rem;
`;

const activeButton = css`
  background-color: ${colors.headers};
  border-color: ${colors.headers};
  color: ${colors.primary};
`;

const $SwitchExerciseButton = styled.li`
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
  ${(props) => (props.active ? activeButton : null)}
`;

const $Paragraph = styled.p`
  margin-bottom: 0;
  margin-top: 0.5rem;
`;

const mapStateToProps = (state) => {
  return {
    userID: state.user.id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ExercisePage);
