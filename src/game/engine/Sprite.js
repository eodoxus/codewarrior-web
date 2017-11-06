import AnimationCollection from "./AnimationCollection";
import Size from "./Size";
import Time from "./Time";
import Vector from "./Vector";

export default class Sprite {
  acceleration;
  animations;
  curAnimation = 0;
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
    this.acceleration = new Vector();
    this.animations = new AnimationCollection(config.animations || {});
    this.id = config.id || this.id;
    this.velocity = new Vector();
    this.scale = config.scale || 1;
    this.size = new Size(
      config.height || this.size.height,
      config.width || this.size.width
    );
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

  getVelocity() {
    return this.velocity;
  }

  setVelocity(v) {
    this.velocity = v;
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

  removeAnimation(name) {
    this.animations.forEach((animation, iDx) => {
      if (animation.name === name) {
        this.animations.splice(iDx, 1);
      }
    });
  }

  update(dt) {
    if (this.velocity.magnitude() === 0) {
      this.getAnimation().reset();
    } else {
      this.getAnimation().update(dt);
    }
    this._dt += dt;
    const frameInterval = dt / Time.SECOND;
    const velocity = Vector.multiply(this.velocity, frameInterval);
    this.position.add(velocity);
  }
}
