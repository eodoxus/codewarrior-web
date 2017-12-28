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
          background: `url(${this.props.texture}) no-repeat -20px 0`,
          width: 20,
          height: 20
        }}
        onClick={this.onClick}
      >
        <span>{this.props.num}</span>
      </div>
    );
  }
}
