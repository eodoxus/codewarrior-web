import React, { Component } from "react";
import styles from "./GameMenusComponent.scss";
import Curtain from "./CurtainComponent";
import Dialog from "./DialogComponent";
import TatteredPage from "./TatteredPageComponent";
import HeroMenu from "./heroMenu/HeroMenuComponent";

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
      </div>
    );
  }
}
