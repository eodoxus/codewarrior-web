import React, { Component } from "react";
import styles from "./GameMenusComponent.scss";
import Curtain from "./CurtainComponent";
import Dialog from "./DialogComponent";
import GameBorder from "./GameBorderComponent";
import HeroMenu from "./heroMenu/HeroMenuComponent";
import TatteredPage from "./TatteredPageComponent";

export default class GameMenusComponent extends Component {
  static menus = [];

  static hasOpenMenus() {
    const isAnyMenuOpen = GameMenusComponent.menus.some(menu => menu.isOpen());
    return isAnyMenuOpen;
  }

  render() {
    return (
      <div className={styles.menus}>
        <HeroMenu />
        <TatteredPage ref={menu => this.addMenu(menu)} />
        <Dialog ref={menu => this.addMenu(menu)} />
        <Curtain />
        <GameBorder />
      </div>
    );
  }

  addMenu(menu) {
    if (!menu) {
      return;
    }
    if (!GameMenusComponent.menus.some(m => m === menu)) {
      GameMenusComponent.menus.push(menu);
    }
  }
}
