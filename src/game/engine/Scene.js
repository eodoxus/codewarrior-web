import React, { Component } from "react";
import Indicators from "../../components/indicators";
import SpriteFrame from "./SpriteFrame";
import SpriteCache from "./SpriteCache";

export default class Scene extends Component {
  static TILE_SIZE = 8;

  sprites;

  constructor(props) {
    super(props);
    this.state = {
      name: "base-scene",
      isLoading: true
    };
    this.sprites = this.props.sprites || [];
  }

  async componentWillMount() {
    await SpriteCache.fetch(this.sprites);
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
        className="scene"
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
          className="sprite"
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
    const sceneBoundary = {
      min: {
        x: 0,
        y: 0
      },
      max: {
        x: this.props.size.width - sprite.size.width * sprite.scale,
        y: this.props.size.height - sprite.size.height * sprite.scale
      }
    };
    if (position.x >= sceneBoundary.max.x) {
      sprite.direction.x *= -1;
      position.x = sceneBoundary.max.x;
    }
    if (position.x <= sceneBoundary.min.x) {
      sprite.direction.x *= -1;
      position.x = sceneBoundary.min.x;
    }
    if (position.y >= sceneBoundary.max.y) {
      sprite.direction.y *= -1;
      position.y = sceneBoundary.max.y;
    }
    if (position.y <= sceneBoundary.min.y) {
      sprite.direction.y *= -1;
      position.y = sceneBoundary.min.y;
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
