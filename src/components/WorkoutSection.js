import { React, Component, Fragment, styled, colors } from "src/imports/react";

class WorkoutSection extends Component {
  generateSetsAndReps = (unit) => {
    let setsAndReps = unit.sets;
    if (unit.reps) setsAndReps += `x${unit.reps}`;
    if (unit.time) setsAndReps += `x${unit.time}s`;
    if (unit.distance) setsAndReps += `x${unit.distance}m`;
    return setsAndReps;
  };

  renderUnits = (complex) => {
    const units = complex.units.map((unit) => (
      <$Unit key={unit.id}>
        <$UnitName>
          {unit.exercise.name}
          {this.props.unitButtons ? this.props.unitButtons(unit) : null}
        </$UnitName>
        <ul>
          <$UnitDetail>{this.generateSetsAndReps(unit)}</$UnitDetail>
          <$UnitDetail>{unit.remarks}</$UnitDetail>
          <$UnitRest>Odpoczywaj {unit.rest}s</$UnitRest>
          <$UnitFeedback>{unit.feedback}</$UnitFeedback>
        </ul>
      </$Unit>
    ));

    return <Fragment>{units}</Fragment>;
  };

  renderComplexes = () => {
    const complexes = this.props.section.complexes.map((complex) => (
      <$Complex key={complex.id}>
        <$ComplexName>
          {complex.name}{" "}
          {this.props.complexButtons ? this.props.complexButtons(complex) : null}
        </$ComplexName>
        {this.renderUnits(complex)}
      </$Complex>
    ));

    return <Fragment>{complexes}</Fragment>;
  };

  render() {
    return (
      <$Section>
        <$SectionName>
          <input
            value={this.props.section.name}
            disabled={!this.props.editable}
            onChange={this.props.changeName}
          />
          {this.props.sectionButtons ? this.props.sectionButtons() : null}
        </$SectionName>
        {this.renderComplexes()}
      </$Section>
    );
  }
}

const $Section = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding-bottom: 25px;
  padding: 1rem;
  min-height: 10rem;
`;

const $SectionName = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: ${colors.headers};
  input {
    height: 28px;
    font-size: 28px;
    font-family: "Teko", sans-serif;
    background: transparent;
    border: none;
    font-weight: 300;
    letter-spacing: 0.2px;
    padding: 0;
    color: inherit;
    outline: none;
    line-height: 1;
  }
`;

const $Complex = styled.div`
  display: flex;
  flex-direction: column;
  
`;

const $ComplexName = styled.h5`
  color: ${colors.headers};
  margin: 0 0 4px 0;
  font-size: 20px;
  display: flex;
  justify-content: space-between;
  button {
    color: white;
  }
`;

const $Unit = styled.div`
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const $UnitName = styled.p`
  margin: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const $UnitDetail = styled.li`
  padding-left: 0.3rem;
  border-left: 1px solid ${colors.faded};
  font-size: 15px;
`;

const $UnitRest = styled($UnitDetail)`
  color: ${colors.faded};
`;

const $UnitFeedback = styled($UnitDetail)`
  color: #5c946e;
`;

export default WorkoutSection;
