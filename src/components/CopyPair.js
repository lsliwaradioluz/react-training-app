import { React, connect, styled, colors, filters } from "src/imports/react";
import { Icon } from "src/imports/components";
import { addEntryToDB } from "src/store/actions";

const CopyPair = (props) => {
  const renderCopyingTab = () => {
    if (props.workoutToCopy) {
      return (
        <$CopyPairTab>
          Kopiujesz trening użytkownika {props.workoutToCopy.user.fullname} z
          dnia {filters.reverseDate(props.workoutToCopy.scheduled)}
          <$CloseButton onClick={props.addEntryToDB.bind(this, "workoutToCopy", null)}>
            <Icon name="cancel" />
          </$CloseButton>
        </$CopyPairTab>
      );
    }
  };

  const renderPairingTab = () => {
    if (props.workoutToPair) {
      return (
        <$CopyPairTab>
          Parujesz z treningiem użytkownika {props.workoutToPair.user.fullname}{" "}
          z dnia {filters.reverseDate(props.workoutToPair.scheduled)}
          <$CloseButton onClick={props.addEntryToDB.bind(this, "workoutToPair", null)}>
            <Icon name="cancel" />
          </$CloseButton>
        </$CopyPairTab>
      );
    }
  };

  return (
    <$CopyPair>
      {renderPairingTab()}
      {renderCopyingTab()}
    </$CopyPair>
  );
};

const $CopyPair = styled.ul`
  position: absolute;
  top: 3rem;
  left: 0;
  padding: 1rem;
`;

const $CopyPairTab = styled.li`
  background-color: ${colors.headers};
  padding: 0.5rem;
  color: black;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const $CloseButton = styled.button`
  margin-left: 3rem;
`;

const mapStateToProps = (state) => {
  return {
    workoutToPair: state.workoutToPair,
    workoutToCopy: state.workoutToCopy,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addEntryToDB: (key, entry) => dispatch(addEntryToDB(key, entry)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CopyPair);
