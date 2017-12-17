import Time from "../../../engine/Time";
import Vector from "../../../engine/Vector";

export default class MovementComponent {
  static create(entity, position) {
    return new MovementComponent(entity, new Vector(), position);
  }

  currentMove;
  entity;
  orientation;
  position;
  velocity;

  constructor(entity, orientation, position) {
    this.entity = entity;
    this.orientation = orientation;
    this.position = position;
    this.velocity = new Vector();
  }

  getCurrentMove() {
    return this.currentMove;
  }

  getPosition() {
    return this.position;
  }

  setPosition(p) {
    this.position = p;
  }

  getOrientation() {
    return this.orientation;
  }

  setOrientation(o) {
    this.orientation = o;
  }

  getVelocity() {
    return this.velocity;
  }

  setVelocity(v) {
    this.velocity = v;
  }

  isMoving() {
    return !!this.currentMove;
  }

  moveTo(position) {
    //console.log("moving to", position);
    this.currentMove = {
      distanceRemaining: this.position.distanceTo(position),
      prev: new Vector(this.position.x, this.position.y),
      end: position
    };

    // Set velocity in the direction of the move
    let vx = Math.abs(this.velocity.x);
    let vy = Math.abs(this.velocity.y);
    if (this.position.x === position.x) {
      vx = 0;
    }
    if (this.position.x > position.x) {
      vx *= -1;
    }
    if (this.position.y === position.y) {
      vy = 0;
    }
    if (this.position.y > position.y) {
      vy *= -1;
    }
    this.velocity = new Vector(vx, vy);
  }

  start() {
    // Override this
  }

  stop() {
    this.velocity = new Vector();
    delete this.currentMove;
  }

  update() {
    const velocity = Vector.multiply(this.velocity, Time.FRAME_STEP_SEC);
    this.position.add(velocity);
    this.updateMove();
  }

  updateMove() {
    if (!this.currentMove) {
      return;
    }

    const position = new Vector(this.position.x, this.position.y);
    const distance = this.currentMove.prev.distanceTo(position);
    this.currentMove.distanceRemaining.subtract(distance);
    this.currentMove.prev = position;

    if (this.currentMove.distanceRemaining.x <= 0) {
      this.velocity.x = 0;
    }

    if (this.currentMove.distanceRemaining.y <= 0) {
      this.velocity.y = 0;
    }

    if (this.velocity.magnitude() === 0) {
      delete this.currentMove;
    } else {
      this.updateOrientation();
    }
  }

  updateOrientation() {
    this.orientation.x = this.velocity.x
      ? this.velocity.x / Math.abs(this.velocity.x)
      : 0;
    this.orientation.y = this.velocity.y
      ? this.velocity.y / Math.abs(this.velocity.y)
      : 0;
  }
}