import React from "react";
import GameEvent from "../../engine/GameEvent";
import MenuItemComponent from "../MenuItemComponent";

export default class TatteredPageItemComponent extends MenuItemComponent {
  onClick = async e => {
    GameEvent.absorbClick(e);
    this.props.tatteredPage.getSpell(0).edit();
  };

  render() {
    return (
      <div
        style={{
          background: `url(${this.props.texture}) no-repeat -32px 0`,
          width: 16,
          height: 16
        }}
        onClick={this.onClick}
      />
    );
  }
}
