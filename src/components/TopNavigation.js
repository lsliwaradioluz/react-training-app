import {
  React,
  styled,
  colors,
  withRouter,
} from "src/imports/react";
import { Icon } from "src/imports/components";
import CopyPair from "src/components/CopyPair";

const TopNavigation = props => {
  const reloadPage = () => {
    window.location.reload();
  };

  const goBack = () => {
    props.history.goBack();
  };

  return (
    <nav>
      <$TopNavigation color={props.color}>
        <$Link onClick={goBack}>
          <Icon name="left-arrow-2" />
        </$Link>
        <$Container>
          <$Link onClick={reloadPage}>
            <Icon name="continuous" />
          </$Link>
          <CopyPair pathname={props.location.pathname} />
        </$Container>
      </$TopNavigation>
    </nav>
  );
}

// Styles
const $TopNavigation = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1005;
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  color: ${(props) => (props.color ? props.color : colors.faded)};
  @media (min-width: 1024px) {
    display: none;
  }
`;

const $Link = styled.li`
  color: inherit;
`;

const $Container = styled.div`
  display: flex;
`;

export default withRouter(TopNavigation);
