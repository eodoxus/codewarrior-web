import MovementComponent from "./MovementComponent";
import PathFinder from "../../../engine/map/PathFinder";
import Rect from "../../../engine/Rect";
import GameEvent from "../../../engine/GameEvent";

export default class PathfindingMovement extends MovementComponent {
  map;
  pathFinder;

  constructor(entity, orientation, position) {
    super(entity, orientation, position);
    this.pathFinder = new PathFinder();
  }

  getMap() {
    return this.map;
  }

  setMap(map) {
    this.map = map;
    this.pathFinder.setMap(map);
  }

  reroute() {
    const curPath = this.pathFinder.getPath();
    if (curPath.length) {
      const end = Rect.point(curPath.shift());
      this.walkTo(end);
    }
  }

  setPosition(position) {
    this.position = this.entity.translateToOrigin(position);
  }

  stop() {
    super.stop();
    this.pathFinder.clear();
  }

  walkTo(tile) {
    if (tile.isWalkable && !tile.isWalkable()) {
      return GameEvent.fire(GameEvent.DIALOG, {
        error: true,
        msg: "I can't walk there"
      });
    }
    const curTile = this.map.getTileAt(this.entity.getOrigin());
    if (!curTile) {
      return;
    }
    this.pathFinder.findPath(curTile.getPosition(), tile.getPosition());
    if (this.pathFinder.getPath().length === 0) {
      GameEvent.fire(GameEvent.DIALOG, {
        error: true,
        msg: "I couldn't find a path there"
      });
    }
    return this.walkToNextStep();
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
