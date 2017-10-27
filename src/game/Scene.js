import React, { Component } from "react";
import styles from "./Scene.scss";

const TILE_SIZE = 32;

export default class Scene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "Base Scene",
      isLoading: false
    };
  }

  onClick(x, y) {
    console.log("scene click", x, y);
  }

  render() {
    return <span>{this.state.name}</span>;
  }

  renderGrid() {}

  renderRow(row, y) {
    const cells = row.map((col, x) => (
      <div className={styles.cell} key={x + "-" + y}>
        {x}, {y}
      </div>
    ));
    return (
      <div className={styles.row} key={y}>
        {cells}
      </div>
    );
  }
}

Scene.defaultProps = {
  top: 100,
  left: 0,
  height: 400,
  width: 400
};
