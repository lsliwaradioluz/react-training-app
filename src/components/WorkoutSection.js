import { React, Component, Fragment, styled, colors } from "src/imports/react";
import Draggable from "src/components/Draggable";

class WorkoutSection extends Component {
  sectionToModify = this.props.section;

  modifySection = (complexIndex, value) => {
    if (complexIndex !== undefined && complexIndex !== null) {
      this.sectionToModify.complexes[complexIndex].units = value;
    } else {
      this.sectionToModify.complexes = value;
    }

    if (this.props.onDragEnd) {
      this.props.onDragEnd(this.sectionToModify);
    }
  };

  generateSetsAndReps = (unit) => {
    let setsAndReps = unit.sets;
    if (unit.reps) setsAndReps += `x${unit.reps}`;
    if (unit.time) setsAndReps += `x${unit.time}s`;
    if (unit.distance) setsAndReps += `x${unit.distance}m`;
    return setsAndReps;
  };

  renderUnits = (complex, complexIndex) => {
    const units = complex.units.map((unit, unitIndex) => (
      <$Unit key={`${unit.id}${unitIndex}`}>
        <$UnitHeader>
          <$UnitName>{unit.exercise.name}</$UnitName>
          {this.props.unitButtons
            ? this.props.unitButtons(unit, unitIndex, complexIndex)
            : null}
        </$UnitHeader>
        <ul>
          <$UnitDetail>{this.generateSetsAndReps(unit)}</$UnitDetail>
          <$UnitDetail>{unit.remarks}</$UnitDetail>
          <$UnitRest>Odpoczywaj {unit.rest}s</$UnitRest>
          <$UnitFeedback>{unit.feedback}</$UnitFeedback>
        </ul>
      </$Unit>
    ));

    return (
      <Fragment>
        {this.props.onDragEnd ? (
          <Draggable
            button="flaticon-vertical-dots"
            value={this.sectionToModify.complexes[complexIndex].units}
            onDragging={this.props.onDragging}
            onDragFail={this.props.onDragFail}
            onInput={this.modifySection.bind(this, complexIndex)}
          >
            {units}
          </Draggable>
        ) : (
          units
        )}
      </Fragment>
    );
  };

  renderComplexes = () => {
    const complexes = this.props.section.complexes.map(
      (complex, complexIndex) => (
        <$Complex key={`${complex.id}${complexIndex}`}>
          <$ComplexHeader>
            <$ComplexName>{complex.name} </$ComplexName>
            {this.props.complexButtons
              ? this.props.complexButtons(complex, complexIndex)
              : null}
          </$ComplexHeader>
          {this.renderUnits(complex, complexIndex)}
        </$Complex>
      )
    );

    if (complexes.length > 0) {
      return (
        <Fragment>
          {this.props.onDragEnd ? (
            <Draggable
              button="flaticon-vertical-dots"
              value={this.sectionToModify.complexes}
              onDragging={this.props.onDragging}
              onDragFail={this.props.onDragFail}
              onInput={this.modifySection.bind(this, null)}
            >
              {complexes}
            </Draggable>
          ) : (
            complexes
          )}
        </Fragment>
      )
    } else {
      return <$Placeholder>W tej sekcji nie ma żadnych ćwiczeń. Dodaj pierwsze, dotykając ikony +.</$Placeholder>
    }

  };

  render() {
    this.sectionToModify = this.props.section;
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
  padding-bottom: 3rem;
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

const $ComplexHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 0 4px 0;
`;

const $ComplexName = styled.h5`
  color: ${colors.headers};
  font-size: 20px;
  margin: 0;
`;

const $Unit = styled.div`
  margin-bottom: 0.5rem;
  padding-left: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
`;

const $UnitHeader = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const $UnitName = styled.p`
  margin: 0;
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

const $Placeholder = styled.p`
  color: ${colors.faded};
`

export default WorkoutSection;
