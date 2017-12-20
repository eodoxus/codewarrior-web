import React, { Component } from "react";
import cx from "classnames";
import styles from "./CurtainComponent.scss";
import GameEvent from "../engine/GameEvent";

export default class CurtainComponent extends Component {
  listeners;

  constructor(props) {
    super(props);
    this.state = { isOpen: true };
  }

  async componentDidMount() {
    this.listeners = [
      GameEvent.on(GameEvent.OPEN_CURTAIN, this.onOpen),
      GameEvent.on(GameEvent.CLOSE_CURTAIN, this.onClose)
    ];
  }

  componentWillUnmount() {
    this.listeners.forEach(listener => listener.remove());
    delete this.listeners;
  }

  onOpen = e => {
    if (this.state.isOpen) {
      return;
    }
    this.setState({ isOpen: true });
  };

  onClose = e => {
    if (!this.state.isOpen) {
      return;
    }
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <div
        className={cx(styles.curtain, !this.state.isOpen ? styles.closed : "")}
      />
    );
  }
}
