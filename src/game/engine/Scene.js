import React, { Component } from "react";
import * as q from "q";
import Indicators from "../../components/indicators";
import SpriteFrame from "./SpriteFrame";
import styles from "./Scene.scss";

export default class Scene extends Component {
  static TILE_SIZE = 8;

  sprites;

  constructor(props) {
    super(props);
    this.state = {
      name: "base-scene",
      isLoading: true
    };
    this.sprites = this.props.sprites;
    this.load();
  }

  async load() {
    let promises = [];
    this.sprites.forEach(sprite => {
      promises.push(sprite.load());
    });
    await q.all(promises);
    this.setState({ isLoading: false });
  }

  onClick(x, y) {
    console.log("scene click", x, y);
  }

  render() {
    if (this.state.isLoading) {
      return <Indicators.Loader />;
    }
    return (
      <div
        className={styles.scene}
        style={this._getPositionStyle(this.props.position, this.props.size)}
      >
        {this.renderSprites()}
      </div>
    );
  }

  renderSprites() {
    return this.sprites.map(sprite => {
      sprite.update(this.props.dt);
      this._handleCollisions(sprite);
      return (
        <div
          className={styles.sprite}
          style={this._getPositionStyle(sprite.getPosition(), sprite.getSize())}
          key={sprite.id}
        >
          <SpriteFrame
            animation={sprite.getAnimation()}
            frame={sprite.getFrame()}
            scale={sprite.getScale()}
          />
        </div>
      );
    });
  }

  _getPositionStyle(position, size) {
    return {
      position: "absolute",
      left: position.x,
      top: position.y,
      width: size.width,
      height: size.height
    };
  }

  _handleCollisions(sprite) {
    let position = sprite.getPosition();
    if (position.x >= this.props.size.width - sprite.size.width) {
      position.x = this.props.size.width;
    }
    if (position.x <= sprite.size.width) {
      position.x = 0;
    }
    if (position.y >= this.props.size.height - sprite.size.height) {
      position.y = this.props.size.height;
    }
    if (position.y <= sprite.size.height) {
      position.y = 0;
    }
    sprite.setPosition(position);
  }
}

Scene.defaultProps = {
  position: {
    x: 100,
    y: 0
  },
  size: {
    width: 400,
    height: 400
  }
};
