import Dialog from "../../../engine/Dialog";
import Tile from "../../../engine/map/Tile";
import Vector from "../../../engine/Vector";

export default class ActorMixin {
  static applyTo(entity) {
    entity.behavior.getDialog = getDialog;
    overwriteMethod(entity.graphics, "intersectsEntity", intersectsEntity);
    entity.movement.getFaceTowardDirection = getFaceTowardDirection;
    entity.movement.faceEntity = faceEntity;
  }
}

function overwriteMethod(property, name, method) {
  let proto = property.__proto__;
  while (true) {
    if (proto[name]) {
      proto[name] = method;
      break;
    }
    proto = proto.__proto__;
    if (!proto) {
      break;
    }
  }
}

function faceEntity(entity) {
  const entityPosition = entity.getOrigin();
  const facingDirection = this.getFaceTowardDirection(entityPosition);
  this.entity.movement.setOrientation(facingDirection);
  this.entity.graphics.updateAnimation();
}

function getDialog() {
  if (!this.dialog) {
    this.dialog = new Dialog(this.entity.getProperty(Tile.PROPERTIES.DIALOG));
  }
  return this.dialog;
}

function getFaceTowardDirection(position) {
  const pos = this.position;
  const size = this.entity.graphics.getSprite().getSize();

  // Is entity directly left or right?
  if (position.y >= pos.y && position.y <= pos.y + size.height) {
    // Is entity to the left?
    if (position.x < pos.x) {
      // Face left
      return new Vector(-1, 0);
    }
    // Face right
    return new Vector(1, 0);
  }

  // Is entity directly above or below?
  if (position.x >= pos.x && position.x <= pos.x + size.width) {
    // Is entity above?
    if (position.y < pos.y) {
      // Face up
      return new Vector(0, -1);
    }
    // Face down
    return new Vector(0, 1);
  }

  // Is entity above ?
  if (position.y < pos.y) {
    // Is entity to the left?
    if (position.x < pos.x) {
      // Face up/left
      return new Vector(-1, -1);
    }
    // Face up/right
    return new Vector(1, -1);
  }

  // Entity must be below
  // Is entity to the left?
  if (position.x < pos.x) {
    // Face down/left
    return new Vector(-1, 1);
  }
  // Face down/right
  return new Vector(1, 1);
}

function intersectsEntity(entity) {
  if (!this.getRect().intersects(entity.graphics.getRect())) {
    return false;
  }
  if (this.entity.isNpc() || entity.isNpc()) {
    return true;
  }
  return this.outlinesIntersect(entity.graphics.getOutline());
}
