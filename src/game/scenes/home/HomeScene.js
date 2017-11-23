import Scene from "../../engine/Scene";
import Graphics from "../../engine/Graphics";
import Vector from "../../engine/Vector";

import mapConfig from "./HomeScene.map.json";

export default class HomeScene extends Scene {
  getName() {
    return "HomeScene";
  }

  getMapConfig() {
    return mapConfig;
  }

  handleCollisions(entity) {
    let position = entity.getPosition();
    const size = entity.getSprite().getSize();
    const scale = Graphics.getScale();
    const sceneBoundary = {
      min: {
        x: 0,
        y: 0
      },
      max: {
        x: (this.size.width - size.width / scale) * scale,
        y: (this.size.height - size.height / scale) * scale
      }
    };
    if (position.x >= sceneBoundary.max.x) {
      entity.getVelocity().multiply(new Vector(-1, 1));
      position.x = sceneBoundary.max.x;
    }
    if (position.x <= sceneBoundary.min.x) {
      entity.getVelocity().multiply(new Vector(-1, 1));
      position.x = sceneBoundary.min.x;
    }
    if (position.y >= sceneBoundary.max.y) {
      entity.getVelocity().multiply(new Vector(1, -1));
      position.y = sceneBoundary.max.y;
    }
    if (position.y <= sceneBoundary.min.y) {
      entity.getVelocity().multiply(new Vector(1, -1));
      position.y = sceneBoundary.min.y;
    }
  }
}
