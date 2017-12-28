import React from "react";
import GameEvent from "../../engine/GameEvent";
import MenuItemComponent from "../MenuItemComponent";
import Dialog from "../../engine/Dialog";

const DIALOG = "HeroMenu.Help";

export default class HelpItemComponent extends MenuItemComponent {
  dialog;

  constructor(props) {
    super(props);
    this.dialog = new Dialog(DIALOG);
    this.dialog.setState(0);
  }

  onClick = e => {
    GameEvent.absorbClick(e);
    GameEvent.fire(GameEvent.DIALOG, this.dialog.getMessage());
  };

  render() {
    return (
      <div
        style={{
          background: `url(${this.props.texture}) no-repeat 0 0`,
          width: 16,
          height: 16
        }}
        onClick={this.onClick}
      />
    );
  }
}
