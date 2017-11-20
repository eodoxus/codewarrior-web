import Scene from "../../engine/Scene";
import Graphics from "../../engine/Graphics";
import TiledMap from "../../engine/map/TiledMap";
import Vector from "../../engine/Vector";

import mapConfig from "./HomeScene.map.json";

export default class HomeScene extends Scene {
  hero;
  map;

  constructor(sprites) {
    super(sprites);
    this.hero = this.sprites[0];
    this.map = new TiledMap("HomeScene", mapConfig);
    this.hero.setPosition(this.map.getHeroSpawnPoint());
  }

  handleCollisions(sprite) {
    let position = sprite.getPosition();
    const scale = Graphics.getScale();
    const sceneBoundary = {
      min: {
        x: 0,
        y: 0
      },
      max: {
        x: (this.size.width - sprite.size.width / scale) * scale,
        y: (this.size.height - sprite.size.height / scale) * scale
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
