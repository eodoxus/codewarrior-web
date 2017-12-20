import React, { Component } from "react";
import styles from "./GameMenusComponent.scss";
import Curtain from "./CurtainComponent";
import Dialog from "./DialogComponent";
import GameBorder from "./GameBorderComponent";
import HeroMenu from "./heroMenu/HeroMenuComponent";
import TatteredPage from "./TatteredPageComponent";

export default class GameMenusComponent extends Component {
  menus = [];

  addMenu(menu) {
    if (menu && !this.menus.find(m => m === menu)) {
      this.menus.push(menu);
    }
  }

  getMenuAt(position) {
    return this.menus.find(menu => {
      return menu.intersects(position);
    });
  }

  intersects(position) {
    return !!this.getMenuAt(position);
  }

  onClick(position) {
    const menu = this.getMenuAt(position);
    if (menu) {
      menu.onClick(position);
    }
  }

  render() {
    return (
      <div className={styles.menus}>
        <HeroMenu ref={heroMenu => this.addMenu(heroMenu)} />
        <TatteredPage ref={tatteredPage => this.addMenu(tatteredPage)} />
        <Dialog />
        <Curtain />
        <GameBorder />
      </div>
    );
  }
}
