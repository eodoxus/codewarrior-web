import AnimationCollection from "./AnimationCollection";
import Size from "./Size";
import Vector from "./Vector";

export default class Sprite {
  animations;
  curAnimation = 0;
  direction;
  id = "sprite";
  position;
  size;
  scale;
  state;
  velocity;

  _dt = 0;

  constructor(
    position = new Vector(0, 0),
    size = new Size(100, 100),
    scale = 1
  ) {
    this.position = position;
    this.size = size;
    this.scale = scale;
  }

  initFromConfig(config) {
    this.animations = new AnimationCollection(config.animations || {});
    this.id = config.id || this.id;
    this.direction = new Vector(0, 0);
    this.scale = config.scale || 1;
    this.size = new Size(
      config.height || this.size.height,
      config.width || this.size.width
    );
    this.velocity = config.velocity || 1;
  }

  getPosition() {
    return this.position;
  }

  setPosition(p) {
    this.position = p;
  }

  getScale() {
    return this.scale;
  }

  setScale(s) {
    this.scale = s;
  }

  getSize() {
    return Size.scale(this.size, this.scale);
  }

  setSize(s) {
    this.size = s;
  }

  getFrame() {
    return this.getAnimation().getFrame();
  }

  addAnimation(animation) {
    this.animations.push(animation);
  }

  getAnimation() {
    return this.animations.get(this.curAnimation);
  }

  getDirection() {
    return this.direction;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  removeAnimation(name) {
    this.animations.forEach((animation, iDx) => {
      if (animation.name === name) {
        this.animations.splice(iDx, 1);
      }
    });
  }

  update(dt) {
    this.getAnimation().update(dt);
    this._dt += dt;
    const direction = this.direction.normalize();
    const positionDiff = this.velocity * dt / 1000;
    this.position.x += direction.x * positionDiff;
    this.position.y += -direction.y * positionDiff;
  }
}
