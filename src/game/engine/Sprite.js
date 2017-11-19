import React from "react";
import AnimationCollection from "./AnimationCollection";
import Screen from "./Screen";
import Size from "./Size";
import TextureCache from "./TextureCache";
import Time from "./Time";
import Vector from "./Vector";

export default class Sprite {
  acceleration;
  animations;
  curAnimation;
  id = "sprite";
  position;
  size;
  state;
  velocity;

  _dt = 0;

  constructor(position = new Vector(), size = new Size(100, 100)) {
    this.position = position;
    this.size = size;
  }

  initFromConfig(config) {
    this.acceleration = new Vector();
    this.animations = new AnimationCollection(config.animations || {});
    this.id = config.id || this.id;
    this.velocity = new Vector();
    this.size = new Size(
      config.width || this.size.width,
      config.height || this.size.height
    );
  }

  getPosition() {
    return this.position;
  }

  setPosition(p) {
    this.position = p;
  }

  getSize() {
    return this.size;
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

  addAnimation(animation) {
    this.animations.push(animation);
  }

  getAnimation() {
    return this.animations && this.animations.get(this.curAnimation);
  }

  setAnimation(name) {
    this.curAnimation = name;
  }

  removeAnimation(name) {
    this.animations.remove(name);
  }

  renderDebug() {
    return (
      <div
        className="sprite-debug"
        key={this.id}
        style={{
          top: this.position.y + this.size.height,
          left: this.position.x + this.size.width
        }}
      >
        acceleration: {this.acceleration.render()}
        <br />
        position: {this.position.render()}
        <br />
        velocity: {this.velocity.render()}
      </div>
    );
  }

  render() {
    const animation = this.getAnimation();
    const frame = animation.getFrame();
    const size = new Size(frame.width, frame.height);
    Screen.drawTexture(
      TextureCache.get(animation.url),
      size,
      new Vector(frame.x, frame.y),
      this.position
    );
  }

  update(dt) {
    const animation = this.getAnimation();
    if (!this.velocity || this.velocity.magnitude() === 0) {
      animation && animation.reset();
    } else {
      animation && animation.update(dt);
    }
    this._dt += dt;
    if (this.velocity) {
      const velocity = Vector.multiply(this.velocity, Time.toSeconds(dt));
      velocity.multiply(Vector.normalize(this.velocity));
      this.position.add(velocity);
    }
  }
}
