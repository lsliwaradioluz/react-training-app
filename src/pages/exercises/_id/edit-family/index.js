import { React, useQuery } from "src/imports/react";
import DefaultLayout from "src/layouts/Default";
import { Header } from "src/imports/components";
import FamilyEditor from "src/components/FamilyEditor";
import { GET_FAMILY } from "src/imports/apollo";

const NewFamilyPage = (props) => {
  let view = null 
  
  const { data } = useQuery(GET_FAMILY, {
    variables: { id: props.match.params.id },
  });

  if (data) {
    view = (
      <DefaultLayout>
        <Header>Edytuj kategorię</Header>
        <FamilyEditor family={data.family} />
      </DefaultLayout>
    )
  }

  return view
};

export default NewFamilyPage;
