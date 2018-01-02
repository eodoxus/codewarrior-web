import Graphics from "./Graphics";
import Size from "./Size";
import Tile from "./map/Tile";
import Vector from "./Vector";

let sceneSize;
const VELOCITY = 5;

export default class SceneTransitioner {
  static getSceneSize() {
    return sceneSize;
  }

  from;
  hero;
  isDone;
  to;
  tile;

  constructor(hero, from, to, tile, size) {
    this.hero = hero;
    this.from = from;
    this.to = to;
    this.tile = tile;
    sceneSize = Size.scale(size, Graphics.getScale());
  }

  async animate() {
    const orientation = this.tile.getProperty(Tile.PROPERTIES.ORIENTATION);
    const velocity = Vector.multiply(orientation, -VELOCITY);
    const toScenePosition = getToScenePosition(orientation);
    this.from.removeEntity(this.hero);
    this.to.removeEntity(this.hero);
    this.from = new TransitionEntity(this.from, new Vector(0, 0), velocity);
    this.to = new TransitionEntity(this.to, toScenePosition, velocity);
    this.hero.getBehavior().beginTransition(velocity, orientation);

    this.update();
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (this.isDone) {
          clearInterval(interval);
          this.to.scene.addEntity(this.hero);
          resolve();
        }
      });
    });
  }

  update() {
    if (this.isDone) {
      return;
    }
    this.isDone = this.from.update();
    this.isDone &= this.to.update();
    this.hero.update();
    Graphics.clear();
    this.from.render();
    this.to.render();
    this.hero.render();
    window.requestAnimationFrame(() => this.update());
  }
}

function getToScenePosition(orientation) {
  // Hero is moving up, position above
  if (orientation.y < 0) {
    return new Vector(0, -sceneSize.height + 1);
  }

  // Hero is moving down, position below
  if (orientation.y > 0) {
    return new Vector(0, sceneSize.height - 1);
  }

  // Hero is moving right, position to the right
  if (orientation.x > 0) {
    return new Vector(sceneSize.width - 1, 0);
  }

  // Hero is moving left, position to the left
  return new Vector(-sceneSize.width + 1, 0);
}

class TransitionEntity {
  end;
  position;
  scene;
  velocity;

  constructor(scene, position, velocity) {
    this.scene = scene;
    this.position = position;
    this.velocity = velocity;
    this.end = this.getEndPosition();
  }

  getEndPosition() {
    // Scene is moving up, position above
    if (this.velocity.y < 0) {
      return Vector.add(this.position, new Vector(0, -sceneSize.height));
    }

    // Scene is moving down, position below
    if (this.velocity.y > 0) {
      return Vector.add(this.position, new Vector(0, sceneSize.height));
    }

    // Scene is moving right, position to the right
    if (this.velocity.x > 0) {
      return Vector.add(this.position, new Vector(sceneSize.width, 0));
    }

    // Scene is moving left, position to the left
    return Vector.add(this.position, new Vector(-sceneSize.width, 0));
  }

  render() {
    const texture = this.scene.renderToTexture();
    Graphics.drawTexture(
      texture.getImage(),
      texture.getSize(),
      texture.getPosition(),
      this.position
    );
  }

  update() {
    const distance = this.position.distanceTo(this.end);
    if (distance.magnitude() < VELOCITY) {
      this.position.add(distance);
      return true;
    }
    this.position.add(this.velocity);
  }
}
