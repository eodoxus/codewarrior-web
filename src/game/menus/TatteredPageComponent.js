import React, { Component } from "react";
import styles from "./TatteredPageComponent.scss";
import GameEvent from "../engine/GameEvent";
import Url from "../../lib/Url";
import TextureCache from "../engine/TextureCache";

export default class TatteredPageComponent extends Component {
  listeners;

  constructor(props) {
    super(props);
    this.state = {
      image: `${Url.PUBLIC}/images/tattered-page.png`,
      isOpen: false
    };
  }

  componentDidMount() {
    this.listeners = [
      GameEvent.on(GameEvent.OPEN_TATTERED_PAGE, this.onOpen, false),
      GameEvent.on(GameEvent.CLOSE_TATTERED_PAGE, this.onClose, false)
    ];
    TextureCache.fetch(this.state.image);
  }

  componentWillUnmount() {
    this.listeners.forEach(listener => listener.remove());
    delete this.listeners;
  }

  onClose = e => {
    if (!this.state.isOpen) {
      return;
    }
    if (e) {
      GameEvent.absorbClick(e);
    }
    this.setState({ isOpen: false });
  };

  onOpen = () => {
    if (this.state.isOpen) {
      return;
    }
    this.setState({ isOpen: true });
  };

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
