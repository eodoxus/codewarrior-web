import Entity from "./Entity";
import PathFinder from "./map/PathFinder";
import Vector from "./Vector";
import Tile from "./map/Tile";

export default class WalkingEntity extends Entity {
  pathFinder;

  constructor(id, position) {
    super(id, position);
    this.pathFinder = new PathFinder();
  }

  reroute() {
    const curPath = this.pathFinder.getPath();
    if (curPath.length) {
      const end = Tile.point(curPath.shift());
      this.walkTo(end);
    }
  }

  setMap(map) {
    this.map = map;
    this.pathFinder.setMap(map);
  }

  stop() {
    super.stop();
    this.pathFinder.clear();
  }

  walkTo(tile) {
    const curTile = this.map.getTileAt(this.getOrigin());
    this.pathFinder.findPath(curTile.getPosition(), tile.getPosition());
    this.walkToNextStep();
  }

  walkToNextStep() {
    const step = this.pathFinder.getNextStep();
    if (step) {
      this.velocity = this.getStateVelocity();
      this.moveTo(step);
    } else {
      this.velocity = new Vector();
    }
    return step;
  }
}
