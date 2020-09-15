import {React} from "src/imports/react";
import DefaultLayout from "src/layouts/Default";
import { Header } from "src/imports/components";
import FamilyEditor from "src/components/FamilyEditor"

const NewFamilyPage = props => {
  return (
    <DefaultLayout>
      <Header>Nowa kategoria</Header>
      <FamilyEditor />
    </DefaultLayout>
  );
}

export default NewFamilyPage;
