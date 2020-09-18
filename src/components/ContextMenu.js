import {
  React,
  styled,
  Component,
  keyframes,
  css,
  connect,
  NavLink,
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
      return this.props.trigger
    } else {
      return <$Icon name="vertical-dots" />
    }
  }

  renderMenuButtons = () => {
    let buttons = null;
    if (this.state.id === this.props.activeContextMenu) {
      buttons = this.props.buttons.map((button, index) => {
        if (button.callback) {
          return (
            <$Button
              key={`button-${index}`}
              onClick={button.callback}
            >
              <$ButtonIcon name={button.icon} />
              {button.caption}
            </$Button>
          );
        } else if (button.link) {
          return (
            <$Link
              key={`button-${index}`}
              to={button.link}
            >
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
      <$ContextMenu>
        <button id={this.state.id} onClick={this.clickTriggerHandler}>
          {this.renderTrigger()}
        </button>
        <$Buttons>{this.renderMenuButtons()}</$Buttons>
      </$ContextMenu>
    );
  }
}

const $ContextMenu = styled.div`
  margin-left: 1rem;
  display: flex;
  position: relative;
`;

const $Icon = styled(Icon)`
  font-size: 18px;
`;

const $Buttons = styled.div`
  background-color: white;
  color: rgba(0, 0, 0, 0.774);
  position: absolute;
  right: 20px;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.233);
  z-index: 1000;
`;

const buttonStyles = css`
  display: flex;
  align-items: center;
  font-weight: 300;
  font-size: 12px;
  padding: .5rem;
  padding-right: 1rem;
  color: black;
  white-space: nowrap;
`

const $Button = styled.button`
  ${buttonStyles}
`;

const $Link = styled(NavLink)`
  ${buttonStyles}
`

const $ButtonIcon = styled(Icon)`
  font-size: 12px;
  margin-right: 6px;
`;

const mapStateToProps = (state) => {
  return {
    activeContextMenu: state.activeContextMenu,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setContextMenu: (contextMenuID) => dispatch(setContextMenu(contextMenuID)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
