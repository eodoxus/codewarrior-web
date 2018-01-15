import Vector from "../../../engine/Vector";

const ANIMATIONS = {
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  UP: "up"
};

export default class BehaviorHelper {
  static detectCollisions(entity, meetsCollisionCondition) {
    meetsCollisionCondition = meetsCollisionCondition || collisionCondition;
    const layers = entity.getMap().getLayers();
    for (let iDx = 0; iDx < layers.length; iDx++) {
      const tiles = layers[iDx].getTiles();
      for (let jDx = 0; jDx < tiles.length; jDx++) {
        const tile = tiles[jDx];
        if (meetsCollisionCondition(entity, tile)) {
          return tile;
        }
      }
    }
  }

  static getDirectionAnimation(entity, prefix = "") {
    const orientation = entity.movement.getOrientation();
    let animationName = ANIMATIONS.DOWN;
    if (orientation.y < 0) {
      animationName = ANIMATIONS.UP;
    }
    if (orientation.y === 0) {
      if (orientation.x > 0) {
        animationName = ANIMATIONS.RIGHT;
      } else if (orientation.x < 0) {
        animationName = ANIMATIONS.LEFT;
      }
    }
    return prefix + animationName;
  }

  static faceToward(entity, tile) {
    const facingDirection = BehaviorHelper.getFaceTowardDirection(entity, tile);
    entity.getMovement().setOrientation(facingDirection);
  }

  static getFaceTowardDirection(entity, tile) {
    const distance = entity.getOrigin().distanceTo(tile.getOrigin());

    // If the y distance is greater than x distance
    // it's either above or below, otherwise it's
    // either left or right
    if (Math.abs(distance.y) >= Math.abs(distance.x)) {
      // If it's above, face up
      if (distance.y > 0) {
        return new Vector(0, -1);
      }
      // Otherwise, it's below, face down
      return new Vector(0, 1);
    } else {
      // If it's to the right, face right
      if (distance.x < 0) {
        return new Vector(1, 0);
      }
      // Otherwise, it's to the left, face left
      return new Vector(-1, 0);
    }
  }

  static isOffScreen(entity) {
    const mapSize = entity.getMap().getSize();
    const entitySize = entity.getSprite().getSize();
    const pos = entity.getPosition();
    return (
      pos.x <= -entitySize.width ||
      pos.x >= mapSize.width ||
      pos.y <= -entitySize.height ||
      pos.y >= mapSize.height
    );
  }
}

function collisionCondition(entity, tile) {
  if (tile.isWalkable()) {
    return false;
  }
  return entity.getGraphics().outlinesIntersect(tile.getOutline());
}
