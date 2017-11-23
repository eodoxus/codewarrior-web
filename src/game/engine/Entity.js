import React from "react";
import Time from "./Time";
import Vector from "./Vector";

export default class Entity {
  position;
  sprite;
  state;
  velocity;

  constructor(position = new Vector()) {
    this.position = position;
    this.dt = 0;
  }

  getPosition() {
    return this.position;
  }

  setPosition(p) {
    this.position = p;
  }

  getSprite() {
    return this.sprite;
  }

  setSprite(s) {
    this.sprite = s;
  }

  getVelocity() {
    return this.velocity;
  }

  setVelocity(v) {
    this.velocity = v;
  }

  renderDebug() {
    return (
      <div
        className="debug"
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
    this.sprite.render(this.position);
  }

  update(dt) {
    this.dt += dt;
    if (this.velocity) {
      const velocity = Vector.multiply(this.velocity, Time.toSeconds(dt));
      velocity.multiply(Vector.normalize(this.velocity));
      this.position.add(velocity);
    }
  }
}
