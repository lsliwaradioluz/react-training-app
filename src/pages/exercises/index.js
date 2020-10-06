import {
  React,
  connect,
  Fragment,
  styled,
  Component,
  apolloClient,
  NavLink
} from "src/imports/react";
import { Header, Placeholder, Input, Icon } from "src/imports/components";
import { GET_FAMILIES } from "src/imports/apollo";
import DefaultLayout from "src/layouts/Default";
import FamilyTab from "src/components/FamilyTab";

class Exercises extends Component {
  state = {
    families: null,
    filter: "",
  };

  async componentDidMount() {
    const { data } = await apolloClient.query({
      query: GET_FAMILIES,
      variables: {
        userId: this.props.user.id,
      },
    });
    this.setState({ families: data.families });
  }

  setFilter = (event) => {
    this.setState({ filter: event.target.value });
  };

  render() {
    let elements = <Placeholder />;
    if (this.state.families) {
      const filteredFamilies = this.state.families.filter((family) => {
        const name = family.name.toLowerCase();
        const filter = this.state.filter.toLowerCase().trim();
        return name.includes(filter);
      });
      let familyTabs = <p>Brak kategorii spełniających podane kryteria</p>
      
      if (filteredFamilies.length > 0) {
        familyTabs = filteredFamilies.map((family) => (
          <FamilyTab
            key={family.id}
            family={family}
            pathname={this.props.history.location.pathname}
          />
        ));
      }

      elements = (
        <Fragment>
          <Header>
            Ćwiczenia
            <NavLink to="exercises/new-family">
              <$Icon name="plus" />
            </NavLink>
          </Header>
          <$Caption>
            Piti daje Ci pełną elastyczność w tworzeniu własnej bazy ćwiczeń.
            Dodaj nowe kategorie i przypisz imodpowiednie ćwiczenia. Możesz
            także swobodnie przenosić ćwiczenia między kategoriami, usuwać i
            edytować je zgodnie z własną wizją.
          </$Caption>
          <Input
            placeholder="Wyszukaj kategorię"
            onChange={this.setFilter}
            value={this.state.filter}
            hideLabel
            search
          />
          {familyTabs}
        </Fragment>
      );
    }

    return (
      <DefaultLayout>
        {elements}
      </DefaultLayout>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.main.user,
  };
};

// Styles

const $Caption = styled.p`
  margin-bottom: 0;
`;

const $Icon = styled(Icon)`
  font-size: 18px;
`

export default connect(mapStateToProps)(Exercises);
