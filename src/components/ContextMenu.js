import {
  React,
  styled,
  Component,
  css,
  connect,
  NavLink,
  keyframes,
} from "src/imports/react";
import { Icon } from "src/imports/components";
import { setContextMenu } from "src/store/actions";

class ContextMenu extends Component {
  state = {
    id: Math.random().toString(36).substr(2, 9),
  };

  clickAnywhereElseHandler = (event) => {
    const closestButton = event.target.closest("button");
    this.props.setContextMenu(closestButton && closestButton);
  };

  clickTriggerHandler = (event) => {
    event.stopPropagation();
    if (this.props.activeContextMenu === this.state.id) {
      this.props.setContextMenu(null);
    } else {
      this.props.setContextMenu(this.state.id);
      setTimeout(() => {
        window.addEventListener("click", this.clickAnywhereElseHandler, {
          once: true,
        });
      });
    }
  };

  renderTrigger = () => {
    if (this.props.trigger) {
      return this.props.trigger;
    } else {
      return <Icon name="vertical-dots" />;
    }
  };

  renderMenuButtons = () => {
    let buttons = null;
    if (this.state.id === this.props.activeContextMenu) {
      buttons = this.props.buttons.map((button, index) => {
        if (button.callback) {
          return (
            <$Button key={`button-${index}`} onClick={button.callback}>
              <$ButtonIcon name={button.icon} />
              {button.caption}
            </$Button>
          );
        } else if (button.link) {
          return (
            <$Link key={`button-${index}`} to={button.link}>
              <$ButtonIcon name={button.icon} />
              {button.caption}
            </$Link>
          );
        }
      });
    }
    return buttons;
  };

  render() {
    return (
      <$ContextMenu className={this.props.className}>
        <$Trigger id={this.state.id} onClick={this.clickTriggerHandler}>
          {this.renderTrigger()}
        </$Trigger>
        {this.props.activeContextMenu === this.state.id ? (
          <$Buttons>{this.renderMenuButtons()}</$Buttons>
        ) : null}
      </$ContextMenu>
    );
  }
}

const openButtons = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
`;

const $ContextMenu = styled.div`
  margin-left: 0.5rem;
  display: flex;
  position: relative;
`;

const $Trigger = styled.button`
  height: 15px;
`

const $Buttons = styled.div`
  background-color: white;
  color: rgba(0, 0, 0, 0.774);
  position: absolute;
  right: 20px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.233);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: ${openButtons} 0.2s forwards;
  transform-origin: top right;
`;

const buttonStyles = css`
  display: flex;
  align-items: center;
  font-weight: 300;
  font-size: 12px;
  padding: 0.5rem;
  padding-right: 1rem;
  color: black;
  white-space: nowrap;
`;

const $Button = styled.button`
  ${buttonStyles}
`;

const $Link = styled(NavLink)`
  ${buttonStyles}
`;

const $ButtonIcon = styled(Icon)`
  font-size: 12px;
  margin-right: 6px;
`;

const mapStateToProps = (state) => {
  return {
    activeContextMenu: state.main.activeContextMenu,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setContextMenu: (contextMenuID) => dispatch(setContextMenu(contextMenuID)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
