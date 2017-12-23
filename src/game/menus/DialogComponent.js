import React, { Component } from "react";
import styles from "./DialogComponent.scss";
import cx from "classnames";
import Dialog from "../engine/Dialog";
import GameEvent from "../engine/GameEvent";
import { Button } from "../../components/forms/controls/buttons/index";

export default class DialogComponent extends Component {
  listener;

  constructor(props) {
    super(props);
    this.state = { dialog: "" };
  }

  async componentDidMount() {
    this.listener = GameEvent.on(GameEvent.DIALOG, this.onDialogEvent);
    await Dialog.load();
  }

  componentWillUnmount() {
    this.listener.remove();
    delete this.listener;
  }

  onCancel = e => {
    GameEvent.absorbClick(e);
    GameEvent.fire(GameEvent.CANCEL, e);
    this.setState({ dialog: "" });
  };

  onClick = e => {
    GameEvent.absorbClick(e);
    this.setState({ dialog: "" });
  };

  onConfirm = e => {
    GameEvent.absorbClick(e);
    GameEvent.fire(GameEvent.CONFIRM, { dialog: this.state.dialog });
    this.setState({ dialog: "" });
  };

  onDialogEvent = dialog => {
    this.setState({ dialog });
  };

  render() {
    if (!this.state.dialog) {
      return "";
    }

    const dialog = this.state.dialog;
    let text = "";
    let error = false;
    if (typeof dialog === "string") {
      text = dialog;
    } else if (dialog.confirm) {
      text = dialog.msg;
    } else if (dialog.error) {
      text = dialog.msg;
      error = true;
    }

    const lines = text
      .split("\n")
      .map((line, key) => <div key={key}>{line}</div>);

    return (
      <div
        className={cx(styles.dialog, error ? styles.error : "")}
        onClick={this.onClick}
      >
        <div className={styles.message}>{lines}</div>
        {this.renderConfirm(dialog)}
      </div>
    );
  }

  renderConfirm(dialog) {
    if (!dialog.confirm) {
      return;
    }
    return (
      <div className={styles.confirmContainer}>
        <div className={styles.confirm}>
          <Button text={dialog.confirm} onClick={this.onConfirm} />
          <Button text={dialog.cancel} onClick={this.onCancel} />
        </div>
      </div>
    );
  }
}
