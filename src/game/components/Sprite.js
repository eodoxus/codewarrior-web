import React, { Component } from "react";
import Scene from "./Scene";
import styles from "./Sprite.scss";

export default class Sprite extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const x = this.props.position.x,
      y = this.props.position.y;
    return (
      <div
        className={styles.sprite}
        style={`left: ${this.props.x}; top: ${this.props.y}`}
      />
    );
  }
}

Sprite.defaultProps = {
  position: {
    x: 0,
    y: 0
  },
  size: {
    width: Scene.TILE_SIZE,
    height: Scene.TILE_SIZE
  }
};
