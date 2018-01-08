import MovementComponent from "./MovementComponent";
import PathFinder from "../../../engine/map/PathFinder";
import Tile from "../../../engine/map/Tile";
import Vector from "../../../engine/Vector";

export default class PatrollingMovement extends MovementComponent {
  static create(entity, position) {
    const route = entity.getProperty(Tile.PROPERTIES.ROUTE);
    const velocity = entity.getProperty(Tile.PROPERTIES.VELOCITY);
    return new PatrollingMovement(entity, position, route, velocity);
  }

  currentPoint;
  isStopped;
  route;
  pathFinder;
  startingVelocity;

  constructor(entity, position, route, velocity) {
    super(entity, velocity, position);
    this.route = route;
    this.currentPoint = 0;
    this.startingVelocity = Vector.copy(velocity);
    this.pathFinder = new PathFinder();
  }

  setMap(map) {
    super.setMap(map);
    this.pathFinder.setMap(map);
  }

  start() {
    this.isStopped = false;
    this.entity.graphics.stop();
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

    if (!this.isMoving()) {
      this.velocity = Vector.copy(this.startingVelocity);
      const hasMoreSteps = this.walkToNextStep();
      if (!hasMoreSteps) {
        this.findPathToNextWaypoint();
        this.walkToNextStep();
      }
      this.updateOrientation();
      this.entity.graphics.start();
    }

    super.update();
  }

  findPathToNextWaypoint() {
    const map = this.entity.getMap();
    // Make the entity walkable temporarily so it doesn't consider
    // itself as a barrier
    const origWalkable = this.entity.isWalkable;
    this.entity.isWalkable = () => true;
    this.pathFinder.findPath(
      map.getTileAt(this.entity.getOrigin()).getPosition(),
      map.getTileAt(this.route[this.currentPoint++]).getPosition()
    );
    this.entity.isWalkable = origWalkable;
    if (this.currentPoint >= this.route.length) {
      this.currentPoint = 0;
    }
  }

  walkToNextStep() {
    const step = this.pathFinder.getNextStep();
    if (step) {
      const position = this.entity.translateToOrigin(step);
      this.moveTo(position);
    }
    return step;
  }
}
