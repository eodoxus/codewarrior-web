import Vector from "../Vector";
import Tile from "./Tile";

export default class PathFinder {
  closedSteps;
  currentStep;
  openSteps;
  path;
  map;

  constructor(map) {
    this.map = map;
    this.path = [];
  }

  clear() {
    this.path = [];
  }

  findPath(start, end) {
    this.openSteps = [];
    this.closedSteps = [];
    const endStep = new Step(end);
    let curStep = start;

    this.clear();
    insertInOpenSteps.call(this, new Step(start));

    do {
      curStep = this.openSteps.shift();
      this.closedSteps.push(curStep);
      if (curStep.isEqualTo(endStep)) {
        break;
      }

      const adjSteps = findWalkableAdjacentTileCoords(
        this.map,
        curStep.position
      );

      for (let iDx in adjSteps) {
        let step = new Step(adjSteps[iDx]);
        if (isInClosedSteps.call(this, step)) {
          continue;
        }

        const moveCost = getMoveCost.call(this, curStep, step);
        const index = getOpenStepIndex.call(this, step);
        if (index === -1) {
          step.parent = curStep;
          step.gScore = curStep.gScore + moveCost;
          step.hScore = computeHScore.call(this, step.position, end);
          insertInOpenSteps.call(this, step);
        } else {
          step = this.openSteps[index];

          if (curStep.gScore + moveCost < step.gScore) {
            step.gScore = curStep.gScore + moveCost;
            this.openSteps.splice(index, 1);
            insertInOpenSteps.call(this, step);
          }
        }
      }
    } while (this.openSteps.length > 0);

    let step = this.closedSteps.pop();
    do {
      if (step.parent) {
        this.path.push(step.position);
      }
      step = step.parent;
    } while (step !== null);

    this.closedSteps = null;
    this.openStep = null;
  }

  getCurrentStep() {
    return Tile.getOrigin(this.currentStep, this.map.getTileSize());
  }

  getNextStep() {
    if (this.path.length) {
      this.currentStep = this.path.pop();
      return this.getCurrentStep();
    }
  }

  setMap(map) {
    this.map = map;
  }
}

class Step {
  position = null;
  gScore = 0;
  hScore = 0;
  parent = null;

  constructor(position) {
    this.position = position;
  }

  fScore() {
    return this.gScore + this.hScore;
  }

  getPosition() {
    return this.position;
  }

  isEqualTo(other) {
    return (
      this.position.x === other.position.x &&
      this.position.y === other.position.y
    );
  }

  description() {
    return (
      "[" +
      this.position.x +
      ", " +
      this.position.y +
      "] g: " +
      this.gScore +
      " h: " +
      this.hScore +
      " F: " +
      this.fScore()
    );
  }
}

function computeHScore(fromPos, toPos) {
  const fromCoord = this.map.toTileCoord(fromPos);
  const toCoord = this.map.toTileCoord(toPos);
  return Math.abs(toCoord.x - fromCoord.x) + Math.abs(toCoord.y - fromCoord.y);
}

function findWalkableAdjacentTileCoords(map, position) {
  const coords = [];
  const tile = map.getTileAt(position);
  const pos = tile.getPosition();
  const tileWidth = tile.getSize().width;
  const tileHeight = tile.getSize().height;

  // top
  let adjTile = map.getTileAt(new Vector(pos.x, pos.y - tileHeight));
  if (adjTile && adjTile.isWalkable()) {
    coords.push(adjTile.getPosition());
  }
  // bottom
  adjTile = map.getTileAt(new Vector(pos.x, pos.y + tileHeight));
  if (adjTile && adjTile.isWalkable()) {
    coords.push(adjTile.getPosition());
  }
  // right
  adjTile = map.getTileAt(new Vector(pos.x + tileWidth, pos.y));
  if (adjTile && adjTile.isWalkable()) {
    coords.push(adjTile.getPosition());
  }
  // left
  adjTile = map.getTileAt(new Vector(pos.x - tileWidth, pos.y));
  if (adjTile && adjTile.isWalkable()) {
    coords.push(adjTile.getPosition());
  }
  /*
  // top right
  adjTile = map.getTileAt(new Vector(pos.x + tileWidth, pos.y - tileHeight));
  if (adjTile && adjTile.isWalkable()) {
    coords.push(adjTile.getPosition());
  }
  // top left
  adjTile = map.getTileAt(new Vector(pos.x - tileWidth, pos.y - tileHeight));
  if (adjTile && adjTile.isWalkable()) {
    coords.push(adjTile.getPosition());
  }
  // bottom right
  adjTile = map.getTileAt(new Vector(pos.x + tileWidth, pos.y + tileHeight));
  if (adjTile && adjTile.isWalkable()) {
    coords.push(adjTile.getPosition());
  }
  // bottom left
  adjTile = map.getTileAt(new Vector(pos.x - tileWidth, pos.y + tileHeight));
  if (adjTile && adjTile.isWalkable()) {
    coords.push(adjTile.getPosition());
  }
  */
  return coords;
}

function getMoveCost(from, to) {
  const diagonalWeight = 1.4; // sqrt(a^2 + b^2) = 1.4, where a and b = 1
  return isDiagonalStep(from.position, to.position) ? diagonalWeight : 1;
}

function getOpenStepIndex(step) {
  for (let iDx = 0; iDx < this.openSteps.length; iDx++) {
    if (step.isEqualTo(this.openSteps[iDx])) {
      return iDx;
    }
  }
  return -1;
}

function insertInOpenSteps(step) {
  const fScore = step.fScore();
  const count = this.openSteps.length;
  let iDx = 0;
  for (; iDx < count; iDx++) {
    if (fScore <= this.openSteps[iDx].fScore()) {
      break;
    }
  }
  this.openSteps.splice(iDx, 0, step);
}

function isInClosedSteps(step) {
  for (let iDx = 0; iDx < this.closedSteps.length; iDx++) {
    if (step.isEqualTo(this.closedSteps[iDx])) {
      return true;
    }
  }
  return false;
}

function isDiagonalStep(from, to) {
  return from.x !== to.x && from.y !== to.y;
}
