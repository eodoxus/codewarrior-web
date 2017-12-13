import Vector from "../../../engine/Vector";

export default class StaticMovement {
  static create(entity, position) {
    return new StaticMovement(entity, new Vector(), position);
  }

  constructor(entity, orientation, position) {
    this.entity = entity;
    this.orientation = orientation;
    this.position = position;
    this.velocity = new Vector();
  }

  getPosition() {
    return this.position;
  }

  setPosition(p) {
    this.position = p;
  }

  getVelocity() {
    return this.velocity;
  }

  update(dt) {
    // Do nothing
  }
}
