import React, { Component } from "react";
import styles from "./GameMenusComponent.scss";
import Curtain from "./CurtainComponent";
import Dialog from "./DialogComponent";
import TatteredPage from "./TatteredPageComponent";

export default class GameMenusComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={styles.menus}>
        <Dialog />
        <TatteredPage />
        <Curtain />
      </div>
    );
  }
}
