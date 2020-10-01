import {
  React,
  Component,
  styled,
  colors,
  filters,
  connect,
} from "src/imports/react";
import { Input, Video, Button, Select, Icon } from "src/imports/components";
import { setNotification } from "src/store/actions";

class UnitEditor extends Component {
  state = {
    family: this.props.unit.exercise
      ? this.props.families.find(
          (family) => family.name === this.props.unit.exercise.family.name
        )
      : "",
    exercise: this.props.unit.exercise || "",
    remarks: this.props.unit.remarks || "",
    sets: this.props.unit.sets || 0,
    reps: this.props.unit.reps || 0,
    time: this.props.unit.time || 0,
    distance: this.props.unit.distance || 0,
    rest: this.props.unit.rest || 60,
  };

  changeState = (key, event) => {
    let newValue;
    if (key === "family" || key === "exercise") {
      newValue = JSON.parse(event.target.value);
    } else if (key === "remarks") {
      newValue = event.target.value;
    } else {
      newValue = +event.target.value;
      if (newValue < 0) {
        newValue = 0;
      }
    }

    this.setState({ [key]: newValue });
  };

  changeNumber = (label, value) => {
    let valueToAdd = value;
    if (label === "rest") {
      valueToAdd *= 5;
    } else if (label === "distance") {
      valueToAdd *= 100;
    }
    this.setState({ [label]: +this.state[label] + valueToAdd });
  };

  generateFamiliesOptions = () => {
    const familiesOptions = this.props.families.map((family) => ({
      name: family.name,
      value: JSON.stringify(family),
    }));
    return familiesOptions;
  };

  generateExercisesOptions = () => {
    return this.state.family.exercises.map((exercise) => ({
      name: exercise.name,
      value: JSON.stringify(exercise),
    }));
  };

  verifyInputs = () => {
    let inputsCorrect = true;
    if (!this.state.exercise) {
      inputsCorrect = false;
      this.props.setNotification("Musisz wybrać ćwiczenie!");
    }
    if (!this.state.sets) {
      inputsCorrect = false;
      this.props.setNotification("Musisz określić liczbę serii!");
    }
    if (!this.state.reps && !this.state.time) {
      inputsCorrect = false;
      this.props.setNotification(
        "Musisz określić liczbę powtórzeń lub czas ćwiczenia!"
      );
    }
    return inputsCorrect;
  };

  saveUnit = () => {
    if (!this.verifyInputs()) {
      return;
    }
    const finishedUnit = { ...this.state };
    delete finishedUnit.family;

    if (this.props.unit.exercise) {
      this.props.update(finishedUnit)
    } else {
      this.props.create(finishedUnit);
    }
    this.props.close();
  };

  renderNumberInputs = () => {
    const labels = ["sets", "reps", "time", "distance", "rest"];
    const numberInputs = labels.map((label, index) => (
      <$NumberInput key={index}>
        <$NumberInputLabel>
          {filters.translateToPolish(label)}
        </$NumberInputLabel>
        <$NumberInputBody>
          <$NumberInputButton
            type="button"
            onClick={this.changeNumber.bind(this, label, -1)}
          >
            <Icon name="minus" />
          </$NumberInputButton>
          <input
            value={this.state[label]}
            onChange={this.changeState.bind(this, label)}
          />
          <$NumberInputButton
            type="button"
            onClick={this.changeNumber.bind(this, label, +1)}
          >
            <Icon name="plus" />
          </$NumberInputButton>
        </$NumberInputBody>
      </$NumberInput>
    ));

    return <$NumberInputs>{numberInputs}</$NumberInputs>;
  };

  renderVideo = () => {
    if (this.state.exercise) {
      return (
        <Video
          opacity="0.7"
          key={this.state.exercise.id}
          source={this.state.exercise.image && this.state.exercise.image.url}
        />
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <$UnitEditor>
        <$Header>
          {this.props.unit.id ? "Edytuj ćwiczenie" : "Nowe ćwiczenie"}
        </$Header>
        {this.renderVideo()}
        <Select
          placeholder="Kategoria"
          options={this.generateFamiliesOptions()}
          value={this.state.family !== "" ? JSON.stringify(this.state.family) : this.state.family}
          onChange={this.changeState.bind(this, "family")}
        />
        {this.state.family ? (
          <Select
            placeholder="Ćwiczenie"
            options={this.generateExercisesOptions()}
            value={this.state.exercise !== "" ? JSON.stringify(this.state.exercise) : this.state.exercise}
            onChange={this.changeState.bind(this, "exercise")}
          />
        ) : null}
        {this.renderNumberInputs()}
        <Input
          placeholder="Uwagi"
          value={this.state.remarks}
          onChange={this.changeState.bind(this, "remarks")}
          showDeleteButton
        />
        <$Buttons>
          <Button click={this.saveUnit}>Zapisz</Button>
          <Button click={this.props.close}>Wróć</Button>
        </$Buttons>
      </$UnitEditor>
    );
  }
}

const $UnitEditor = styled.div`
  padding: 1rem;
  background-color: ${colors.secondary};
  position: relative;
`;

const $Header = styled.h3`
  color: ${colors.headers};
  z-index: 3;
  position: relative;
`;

const $Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    flex-basis: 49%;
    margin-bottom: 0;
  }
`;

const $NumberInputs = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
`;

const $NumberInput = styled.div`
  display: flex;
  flex-basis: 48%;
  flex-direction: column;
  margin-bottom: 1rem;
`;

const $NumberInputLabel = styled.label`
  margin-bottom: 2px;
  font-size: 12px;
  color: ${colors.faded};
`;

const $NumberInputBody = styled.div`
  display: flex;
  justify-content: space-between;
  border-top: 1px solid ${colors.faded};
  border-bottom: 1px solid ${colors.faded};
  input {
    background-color: transparent;
    border: none;
    text-align: center;
    outline: none;
    color: white;
    width: 60px;
    font-size: 20px;
  }
`;

const $NumberInputButton = styled.button`
  border-left: 1px solid ${colors.faded};
  border-right: 1px solid ${colors.faded};
  padding: 0.5rem;
  color: ${colors.faded};
`;

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notification) => dispatch(setNotification(notification)),
  };
};

export default connect(null, mapDispatchToProps)(UnitEditor);
