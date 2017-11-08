import Scene from "../../engine/Scene";
import Vector from "../../engine/Vector";

export default class HomeScene extends Scene {
  handleCollisions(sprite) {
    let position = sprite.getPosition();
    const sceneBoundary = {
      min: {
        x: 0,
        y: 0
      },
      max: {
        x: this.size.width - sprite.size.width * sprite.scale,
        y: this.size.height - sprite.size.height * sprite.scale
      }
    };
    if (position.x >= sceneBoundary.max.x) {
      sprite.getVelocity().multiply(new Vector(-1, 1));
      position.x = sceneBoundary.max.x;
    }
    if (position.x <= sceneBoundary.min.x) {
      sprite.getVelocity().multiply(new Vector(-1, 1));
      position.x = sceneBoundary.min.x;
    }
    if (position.y >= sceneBoundary.max.y) {
      sprite.getVelocity().multiply(new Vector(1, -1));
      position.y = sceneBoundary.max.y;
    }
    if (position.y <= sceneBoundary.min.y) {
      sprite.getVelocity().multiply(new Vector(1, -1));
      position.y = sceneBoundary.min.y;
    }
    sprite.setPosition(position);
  }
}
