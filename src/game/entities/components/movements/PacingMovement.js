import MovementComponent from "./MovementComponent";
import Vector from "../../../engine/Vector";

export default class PacingMovement extends MovementComponent {
  travelDistance;
  endPosition;
  startPosition;
  startingVelocity;
  isReturning;
  isStopped;
  maxDistance;

  constructor(entity, orientation, position, endPosition, velocity) {
    super(entity, orientation, position);
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

  update(dt) {
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

    super.update(dt);

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
