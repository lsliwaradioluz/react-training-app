import {
  React,
  Component,
  apolloClient,
  connect,
  styled,
  Fragment,
  withRouter,
  colors,
  cloneDeep,
} from "src/imports/react";
import FileInput from "src/components/FileInput";
import { Input, Select, Button, Video } from "src/imports/components";
import {
  GET_FAMILIES,
  CREATE_EXERCISE,
  UPDATE_EXERCISE,
} from "src/imports/apollo";
import { setNotification } from "src/store/actions";

class ExerciseEditor extends Component {
  state = {
    families: [],
    editedExercise: {
      name: this.props.exercise ? this.props.exercise.name : "",
      family: this.props.match.params.id,
    },
    loadedVideo: this.props.exercise ? this.props.exercise.image : null,
    startingFamily: this.props.match.params.id,
  };

  async componentDidMount() {
    const { data } = await apolloClient.query({
      query: GET_FAMILIES,
      variables: {
        userId: this.props.userID,
      },
    });

    this.setState({ families: data.families });
  }

  generateFamiliesOptions = () => {
    return this.state.families.map((family) => ({
      name: family.name,
      value: family.id,
    }));
  };

  changeName = (event) => {
    const changedName = event.target.value;
    this.setState((state, props) => {
      const editedExerciseCopy = {
        ...state.editedExercise,
        name: changedName,
      };
      return {
        editedExercise: editedExerciseCopy,
      };
    });
  };

  changeFamily = (event) => {
    const changedFamily = event.target.value;
    this.setState((state, props) => {
      const editedExerciseCopy = {
        ...state.editedExercise,
        family: changedFamily,
      };
      return {
        editedExercise: editedExerciseCopy,
      };
    });
  };

  setLoadedVideo = (video) => {
    this.setState({ loadedVideo: video });
  };

  commenceCreateExercise = () => {
    const callback = this.props.exercise
      ? this.updateExercise
      : this.createExercise;
    this.setState((state) => {
      const updatedEditedExercise = {
        ...state.editedExercise,
      };
      if (state.loadedVideo) {
        updatedEditedExercise.image = state.loadedVideo._id;
      }

      return { editedExercise: updatedEditedExercise };
    }, callback);
  };

  updateCache = (cache, exercise) => {
    try {
      const { families } = cloneDeep(
        cache.readQuery({
          query: GET_FAMILIES,
          variables: { userId: this.props.userID },
        })
      );
      
      const currentFamily = families.find(
        (family) => family.id === this.state.startingFamily
      );

      if (!this.props.exercise) {
        currentFamily.exercises.push(exercise)
      }

      if (this.state.startingFamily !== this.state.editedExercise.family) {
        currentFamily.exercises = currentFamily.exercises.filter(e => e.id !== exercise.id)
        const newFamily = families.find(
          (family) => family.id === this.state.editedExercise.family
        );
        newFamily.exercises.push(exercise)
      }

      apolloClient.writeQuery({
        query: GET_FAMILIES,
        variables: { userId: this.props.userID },
        data: {
          families,
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  createExercise = () => {
    apolloClient
      .mutate({
        mutation: CREATE_EXERCISE,
        variables: { input: this.state.editedExercise },
        update: (cache, { data: { createExercise } }) => {
          this.updateCache(cache, createExercise)
        },
      })
      .then(() => {
        this.props.history.goBack();
      })
      .catch(() => {
        this.props.setNotification(
          "Nie udało się stworzyć ćwiczenia. Sprawdź połączenie z Internetem"
        );
      });
  };

  updateExercise = () => {
    apolloClient
      .mutate({
        mutation: UPDATE_EXERCISE,
        variables: {
          input: { ...this.state.editedExercise, id: this.props.exercise.id },
        },
        update: (cache, { data: { updateExercise } }) => {
          this.updateCache(cache, updateExercise)
        },
      })
      .then(() => {
        this.props.history.goBack();
      })
      .catch(() => {
        this.props.setNotification(
          "Nie udało się stworzyć ćwiczenia. Sprawdź połączenie z Internetem"
        );
      });
  };

  render() {
    return (
      <Fragment>
        <p>
          Ćwiczenie w aplikacji Piti musi posiadać nazwę, kategorię oraz wideo
          poglądowe. Akceptowane są tylko filmy w formacie mp4, w preferowanej
          rozdzielczości 16:9.
        </p>
        <Input
          placeholder="Nazwa ćwiczenia"
          onChange={this.changeName}
          value={this.state.editedExercise.name}
        />
        <Select
          placeholder="Nazwa ćwiczenia"
          options={this.generateFamiliesOptions()}
          value={this.state.editedExercise.family}
          onChange={this.changeFamily}
        />
        {this.state.loadedVideo ? (
          <$VideoContainer>
            <Video source={this.state.loadedVideo.url} />
          </$VideoContainer>
        ) : null}
        <FileInput
          file={this.state.loadedVideo}
          onUploadFinish={this.setLoadedVideo}
          onDeleteFile={this.setLoadedVideo.bind(this, null)}
        />
        <$Buttons>
          <$Button click={this.commenceCreateExercise}>Zapisz</$Button>
          <$Button click={this.props.history.goBack}>Anuluj</$Button>
        </$Buttons>
      </Fragment>
    );
  }
}

const $VideoContainer = styled.div`
  position: relative;
  height: 60vh;
  border: 1px solid ${colors.faded};
  border-radius: 6px;
`;

const $Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const $Button = styled(Button)`
  flex-basis: 49%;
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ExerciseEditor));
