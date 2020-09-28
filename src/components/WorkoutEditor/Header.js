import { React, Fragment, styled } from "src/imports/react";
import { Header } from "src/imports/components";

const EditorHeader = (props) => {
  return (
    <Fragment>
      <Header>{props.edit ? "Edytuj trening" : "Nowy trening"}</Header>
      <$Caption>
        Przygotuj rozpiskę dla podopiecznego {props.username},
        wykorzystując innowacyjny edytor treningów. Kopiuj gotowe elementy z
        poprzednich sesji lub twórz całkowice nowe.
      </$Caption>
    </Fragment>
  );
};

const $Caption = styled.p`
  margin: 0;
`;

export default EditorHeader;
