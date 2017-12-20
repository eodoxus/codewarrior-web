import React from "react";
import GameEvent from "../../engine/GameEvent";
import MenuItemComponent from "../MenuItemComponent";

const HELP_TEXT =
  "Click anywhere on the screen to move around.\nAs you progress, more items will appear in Hero's menu.";

export default class HelpItemComponent extends MenuItemComponent {
  onClick() {
    GameEvent.fire(GameEvent.DIALOG, HELP_TEXT);
  }

  render() {
    return (
      <div
        style={{
          background: `url(${this.props.texture}) no-repeat 0 0`,
          width: 16,
          height: 16
        }}
        onClick={this.onClick}
        ref={el => this.setEl(el)}
      />
    );
  }
}
