import MovementComponent from "./MovementComponent";
import Vector from "../../../engine/Vector";

export default class PacingMovement extends MovementComponent {
  static create(entity, position) {
    const endPosition = new Vector(
      parseFloat(entity.getProperty("endX")),
      parseFloat(entity.getProperty("endY"))
    );
    const velocity = new Vector(
      parseFloat(entity.getProperty("velocityX")),
      parseFloat(entity.getProperty("velocityY"))
    );
    return new PacingMovement(entity, position, endPosition, velocity);
  }

  travelDistance;
  endPosition;
  startPosition;
  startingVelocity;
  isReturning;
  isStopped;
  maxDistance;

  constructor(entity, position, endPosition, velocity) {
    super(entity, velocity, position);
    this.startPosition = Vector.copy(position);
    this.endPosition = endPosition;
    this.startingVelocity = Vector.copy(velocity);
    this.maxDistance = this.startPosition
      .distanceTo(this.endPosition)
      .magnitude();
  }

  getEndPosition() {
    return this.endPosition;
  }

  getStartPosition() {
    return this.startPosition;
  }

  start() {
    this.isStopped = false;
    this.entity.graphics.start();
  }

  stop() {
    super.stop();
    this.entity.graphics.stop();
    this.isStopped = true;
  }

  update() {
    if (this.isStopped) {
      return;
    }

    const destination = this.isReturning
      ? this.startPosition
      : this.endPosition;
    if (!this.isMoving()) {
      this.velocity = Vector.copy(this.startingVelocity);
      this.moveTo(destination);
      this.updateOrientation();
      this.entity.graphics.start();
      this.isReturning = !this.isReturning;
    }

    super.update();

    const startPosition = this.isReturning
      ? this.startPosition
      : this.endPosition;
    const distanceTravelled = startPosition
      .distanceTo(this.position)
      .magnitude();
    if (distanceTravelled > this.maxDistance) {
      this.position = Vector.copy(
        this.isReturning ? this.endPosition : this.startPosition
      );
    }
  }
}
