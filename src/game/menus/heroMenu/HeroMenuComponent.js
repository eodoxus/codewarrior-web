import React from "react";
import styles from "./HeroMenuComponent.scss";
import cx from "classnames";
import GameEvent from "../../engine/GameEvent";
import Graphics from "../../engine/Graphics";
import HelpItem from "./HelpItemComponent";
import MenuComponent from "../MenuComponent";
import SpellItem from "./SpellItemComponent";
import TatteredPage from "../../entities/items/TatteredPage";
import TatteredPageItem from "./TatteredPageItem";
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
    this.hero = hero;
    this.updatePosition(hero.getPosition());
    this.startPollingPosition(hero);
    this.setState({ isOpen: true });
  };

  render() {
    if (!this.state.position) {
      return "";
    }
    const topMenu = this.state.isOpen ? (
      <div className={styles.topMenu}>{this.renderSpells()}</div>
    ) : (
      ""
    );
    const sideMenu = this.state.isOpen ? (
      <div className={styles.sideMenu}>
        {this.renderEditItem()}
        <div className={cx(styles.item, "menu-item")} key={"help"}>
          <HelpItem texture={MENU_TEXTURE} />
        </div>
      </div>
    ) : (
      ""
    );
    return (
      <div
        className={cx(styles.menu, this.state.isOpen ? styles.open : "")}
        style={{
          top: this.state.position.y,
          left: this.state.position.x
        }}
      >
        {topMenu}
        {sideMenu}
      </div>
    );
  }

  renderEditItem() {
    const tatteredPage = this.hero.getInventory().get(TatteredPage.NAME);
    if (tatteredPage) {
      return (
        <div className={cx(styles.item, "menu-item")} key={"tatteredPage"}>
          <TatteredPageItem
            texture={MENU_TEXTURE}
            tatteredPage={tatteredPage}
          />
        </div>
      );
    }
  }

  renderSpells() {
    let numSpells = 0;
    const tatteredPage = this.hero.getInventory().get(TatteredPage.NAME);
    if (tatteredPage) {
      return tatteredPage.getSpells().map(spell => (
        <div
          className={cx(styles.item, "menu-item")}
          key={"spell" + numSpells++}
        >
          <SpellItem texture={MENU_TEXTURE} spell={spell} num={numSpells} />
        </div>
      ));
    }
  }

  renderItem(item) {}

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
