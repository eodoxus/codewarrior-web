import React, { Component } from "react";
import styles from "./GameMenusComponent.scss";
import Curtain from "./CurtainComponent";
import Dialog from "./DialogComponent";
import GameBorder from "./GameBorderComponent";
import HeroMenu from "./heroMenu/HeroMenuComponent";
import TatteredPage from "./TatteredPageComponent";

export default class GameMenusComponent extends Component {
  render() {
    return (
      <div className={styles.menus}>
        <HeroMenu />
        <TatteredPage />
        <Dialog />
        <Curtain />
        <GameBorder />
      </div>
    );
  }
}
