import React from "react";
import styles from "./HeroMenuComponent.scss";
import cx from "classnames";
import GameEvent from "../../engine/GameEvent";
import Graphics from "../../engine/Graphics";
import MenuComponent from "../MenuComponent";
import HelpItem from "./HelpItemComponent";
import TextureCache from "../../engine/TextureCache";
import Url from "../../../lib/Url";
import Vector from "../../engine/Vector";

const MENU_TEXTURE = Url.SPRITES + "hero-menu.png";
const POLLING_INTERVAL = 10;

export default class HeroMenuComponent extends MenuComponent {
  pollingInterval;

  componentDidMount() {
    this.listeners = [
      GameEvent.on(GameEvent.OPEN_HERO_MENU, e => this.onOpen(e)),
      GameEvent.on(GameEvent.CLOSE_HERO_MENU, e => this.onClose(e))
    ];
    TextureCache.fetch(MENU_TEXTURE);
  }

  componentWillUnmount() {
    this.listeners.forEach(listener => listener.remove());
    delete this.listeners;
  }

  onClose = e => {
    if (!this.state.isOpen) {
      return;
    }
    this.setState({ isOpen: false });
    clearInterval(this.pollingInterval);
  };

  onOpen = hero => {
    if (this.state.isOpen) {
      return this.onClose();
    }
    this.updatePosition(hero.getPosition());
    this.startPollingPosition(hero);
    this.setState({ isOpen: true });
  };

  render() {
    if (!this.state.position) {
      return "";
    }
    return (
      <div
        className={cx(styles.menu, this.state.isOpen ? styles.open : "")}
        style={{
          top: this.state.position.y,
          left: this.state.position.x
        }}
      >
        <div className={styles.item}>
          <HelpItem texture={MENU_TEXTURE} />
        </div>
      </div>
    );
  }

  updatePosition(heroPosition) {
    let position = Vector.multiply(heroPosition, Graphics.getInverseScale());
    this.setState({ position });
  }

  startPollingPosition(hero) {
    this.pollingInterval = setInterval(() => {
      this.updatePosition(hero.getPosition());
    }, POLLING_INTERVAL);
  }
}
