import React from "react";
import styles from "./TatteredPageComponent.scss";
import GameEvent from "../engine/GameEvent";
import MenuComponent from "./MenuComponent";
import Url from "../../lib/Url";
import TextureCache from "../engine/TextureCache";

export default class TatteredPageComponent extends MenuComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: `${Url.PUBLIC}/images/tattered-page.png`
    };
  }

  componentDidMount() {
    this.listeners = [
      GameEvent.on(GameEvent.OPEN_TATTERED_PAGE, this.onOpen),
      GameEvent.on(GameEvent.CLOSE_TATTERED_PAGE, this.onClose)
    ];
    TextureCache.fetch(this.state.image);
  }

  onClick(position) {
    console.log("tattered page clicked", position);
  }

  render() {
    if (!this.state.isOpen) {
      return "";
    }

    return (
      <div
        className={styles.container}
        style={{
          backgroundImage: `url(${this.state.image})`
        }}
        onClick={GameEvent.absorbClick}
      >
        <div className={styles.close + " close"} onClick={this.onClose}>
          <span>x</span>
        </div>
      </div>
    );
  }
}
