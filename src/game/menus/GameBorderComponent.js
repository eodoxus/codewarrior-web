import React from "react";
import styles from "./GameBorderComponent.scss";
import GameEvent from "../engine/GameEvent";
import MenuComponent from "./MenuComponent";
import Url from "../../lib/Url";

export default class GameBorderComponent extends MenuComponent {
  constructor(props) {
    super(props);
    this.state = { dialog: "" };
  }

  async componentDidMount() {
    this.listener = [
      GameEvent.on(GameEvent.SHOW_BORDER, this.onOpen),
      GameEvent.on(GameEvent.HIDE_BORDER, this.onClose)
    ];
  }

  render() {
    if (!this.state.isOpen) {
      return "";
    }
    return (
      <div
        className={styles.border}
        style={{
          backgroundImage: `url(${Url.PUBLIC}/images/game-border.png)`
        }}
        onClick={this.onClick}
      />
    );
  }
}
