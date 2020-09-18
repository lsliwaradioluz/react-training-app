import { React, Component, styled, colors } from "src/imports/react";
import { Input, Button } from "src/imports/components";

class FeedbackEditor extends Component {
  state = {
    feedback: this.props.unit.feedback,
  };

  editFeedback = (event) => {
    const newFeedback = event.target.value
    this.setState({ feedback: newFeedback })
  };

  render() {
    return (
      <$FeedbackEditor>
        <$Header>Dodaj notatkę</$Header>
        <Input
          placeholder="Jak poszło to ćwiczenie?"
          value={this.state.feedback}
          onChange={this.editFeedback}
        />
        <$Buttons>
          <$Button click={this.props.onSave.bind(this, this.state.feedback)}>Zapisz</$Button>
          <$Button click={this.props.clickReturn}>Wróć</$Button>
        </$Buttons>
      </$FeedbackEditor>
    );
  }
}

const $FeedbackEditor = styled.div`
  border-radius: 6px;
  padding: 1rem;
  background-color: ${colors.secondary};
`;

const $Header = styled.h3`
  color: ${colors.headers};
  margin-bottom: 0.5rem;
`;

const $Buttons = styled.div`
  display: flex;
  justify-content: space-between;
`;

const $Button = styled(Button)`
  flex-basis: 49%;
  margin-bottom: 0;
`;

export default FeedbackEditor;
