import { React, Fragment, styled, colors } from "src/imports/react";
import { Input, Checkbox, CarouselContainer } from "src/imports/components";
import Subheader from "src/components/WorkoutEditor/Subheader"

const EditorDatePicker = (props) => {
  let inputs;
  if (props.workoutData.sticky) {
    inputs = (
      <$NameInput
        placeholder="Nazwa treningu"
        value={props.workoutData.name}
        onChange={props.change.bind(this, "name")}
      />
    );
  } else {
    inputs = (
      <Fragment>
        <Input
          type="date"
          placeholder="Data"
          value={props.workoutData.selectedDate}
          onChange={props.change.bind(this, "selectedDate")}
        />
        <Input
          type="time"
          placeholder="Godzina"
          value={props.workoutData.selectedTime}
          onChange={props.change.bind(this, "selectedTime")}
        />
      </Fragment>
    );
  }
  return (
    <Fragment>
      <Subheader>Termin</Subheader>
      <$EditorDatePicker>
        <Checkbox
          label="Przyklejony"
          value={props.workoutData.sticky}
          onChange={props.change.bind(this, "sticky")}
        />
        {inputs}
      </$EditorDatePicker>
    </Fragment>
  );
};

const $EditorDatePicker = styled(CarouselContainer)`
  padding: 1rem 1rem 0 1rem;
  background-color: ${colors.secondary};
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

const $NameInput = styled(Input)`
  flex-grow: 1;
  margin-left: 1rem;
`;

export default EditorDatePicker;
