import React from "react";
import GameEvent from "../../engine/GameEvent";
import MenuItemComponent from "../MenuItemComponent";

export default class SpellItemComponent extends MenuItemComponent {
  onClick = async e => {
    GameEvent.absorbClick(e);
    try {
      await this.props.spell.cast();
    } catch (e) {}
  };

  render() {
    return (
      <div
        style={{
          background: `url(${this.props.texture}) no-repeat -16px 0`,
          width: 16,
          height: 16
        }}
        onClick={this.onClick}
      />
    );
  }
}
