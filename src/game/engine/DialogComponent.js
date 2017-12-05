import React, { Component } from "react";
import styles from "./DialogComponent.scss";
import Dialog from "./Dialog";
import GameEvent from "./GameEvent";

export default class DialogComponent extends Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
  }

  async componentDidMount() {
    await Dialog.load();
    GameEvent.on(GameEvent.DIALOG, this.onDialogEvent);
  }

  onDialogEvent = text => {
    this.setState({ text });
  };

  render() {
    if (!this.state.text) {
      return "";
    }
    const lines = this.state.text.split("\n").map((line, key) => {
      return (
        <span key={key}>
          {line}
          <br />
        </span>
      );
    });
    return <div className={styles.dialog}>{lines}</div>;
  }
}
