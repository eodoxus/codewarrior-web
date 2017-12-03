import Entity from "./Entity";
import PathFinder from "./map/PathFinder";
import Rect from "./Rect";
import Vector from "./Vector";

export default class WalkingEntity extends Entity {
  currentMove;
  pathFinder;

  constructor(id, position) {
    super(id, position);
    this.pathFinder = new PathFinder();
  }

  getCurrentMove() {
    return this.currentMove;
  }

  moveTo(position) {
    position = this.translateToOrigin(position);
    //console.log("moving to", position);
    this.currentMove = {
      distanceRemaining: this.position.distanceBetween(position),
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

  reroute() {
    const curPath = this.pathFinder.getPath();
    if (curPath.length) {
      const end = Rect.point(curPath.shift());
      this.walkTo(end);
    }
  }

  setMap(map) {
    this.map = map;
    this.pathFinder.setMap(map);
  }

  stop() {
    delete this.currentMove;
    this.pathFinder.clear();
  }

  update(dt) {
    super.update(dt);
    this.updateMove();
  }

  updateMove() {
    if (!this.currentMove) {
      return;
    }

    const position = new Vector(this.position.x, this.position.y);
    const distance = this.currentMove.prev.distanceBetween(position);
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
    }
  }

  walkTo(tile) {
    const curTile = this.map.getTileAt(this.getOrigin());
    this.pathFinder.findPath(curTile.getPosition(), tile.getPosition());
    this.walkToNextStep();
  }

  walkToNextStep() {
    const step = this.pathFinder.getNextStep();
    if (step) {
      this.moveTo(step);
    }
    return step;
  }
}
