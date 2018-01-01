import Dialog from "../../../engine/Dialog";
import Tile from "../../../engine/map/Tile";
import Vector from "../../../engine/Vector";
import Time from "../../../engine/Time";

const MAGIC_REGENERATION_RATE = 512;

export default class ActorMixin {
  static applyTo(entity) {
    entity.behavior.getDialog = getDialog;
    overwriteMethod(entity.graphics, "intersectsEntity", intersectsEntity);
    entity.movement.getFaceTowardDirection = getFaceTowardDirection;
    entity.movement.faceEntity = faceEntity;
    entity.getHealth = getHealth;
    entity.getMagic = getMagic;
    entity.hasMagic = hasMagic;
    entity.spendMagic = spendMagic;
    entity.origUpdate = entity.update;
    entity.update = update;
    entity.updateMagic = updateMagic;
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

function getHealth() {
  return this.health;
}

function getMagic() {
  return this.magic;
}

function hasMagic() {
  return this.magic > 0;
}

function spendMagic(points) {
  this.magic -= points;
  if (this.magic <= 0) {
    this.magic = 0;
  }
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

function update() {
  this.origUpdate();
  this.updateMagic();
}

function updateMagic() {
  if (!this.magicTimer) {
    this.magicTimer = Time.timer();
  }
  if (this.magicTimer.elapsed() >= MAGIC_REGENERATION_RATE) {
    this.magic += 1;
    if (this.magic > this.totalMagic) {
      this.magic = this.totalMagic;
    }
    this.magicTimer.reset();
  }
}
