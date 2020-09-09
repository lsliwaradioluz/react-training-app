import { React, styled, colors, withRouter } from "src/imports/react";
import { Icon } from "src/imports/components";

const Navigation = (props) => {
  const reloadPage = () => {
    window.location.reload()
  }

  const goBack = () => {
    props.history.goBack()
  }

  return (
    <nav>
      <TopLinks>
        <TopLink onClick={goBack}>
          <Icon name="left-arrow-2" />
        </TopLink>
        <TopLink onClick={reloadPage}>
          <Icon name="continuous" />
        </TopLink>
      </TopLinks>
    </nav>
  );
};

// Styles
const TopLinks = styled.ul`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
`;

const TopLink = styled.li`
  color: ${colors.faded};
`;

export default withRouter(Navigation);
