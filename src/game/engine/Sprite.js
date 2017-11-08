import React from "react";
import AnimationCollection from "./AnimationCollection";
import Size from "./Size";
import SpriteCache from "./SpriteCache";
import Time from "./Time";
import Vector from "./Vector";

export default class Sprite {
  acceleration;
  animations;
  curAnimation;
  id = "sprite";
  position;
  size;
  scale;
  state;
  velocity;

  _dt = 0;

  constructor(position = new Vector(), size = new Size(100, 100), scale = 1) {
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
          top: this.position.y + this.size.height * this.scale,
          left: this.position.x + this.size.width * this.scale
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

  render(context) {
    const animation = this.getAnimation();
    const frame = animation.getFrame();
    context.drawImage(
      SpriteCache.get(animation.url),
      frame.x, // source
      frame.y,
      frame.width,
      frame.height,
      this.position.x, // dest
      this.position.y,
      frame.width * this.scale,
      frame.height * this.scale
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
