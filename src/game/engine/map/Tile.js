export default class Tile {
  static OBJECT_TYPE_COLLECTABLE = "collectable";
  static OBJECT_TYPE_DOORWAY = "doorway";
  static OBJECT_TYPE_SPAWN_HERO = "spawn_hero";
  static OBJECT_TYPE_TRANSITION = "transition";

  gid;
  position;
  tilesetPosition;
  size;
  properties;

  constructor(position, size, gid = 0, properties = {}) {
    this.position = position;
    this.size = size;
    this.gid = gid;
    this.properties = properties;
  }

  intersects(tile) {
    const aRect = this.getRect();
    const bRect = tile.getRect();
    return (
      aRect.x < bRect.x + bRect.width &&
      aRect.x + aRect.width > bRect.x &&
      aRect.y < bRect.y + bRect.height &&
      aRect.height + aRect.y > bRect.y
    );
  }

  isCollectable() {
    return this.properties.isCollectable;
  }

  isDoorway() {
    return this.properties.isDoorway;
  }

  isTransition() {
    return this.properties.isTransition;
  }

  isWalkable() {
    return !this.properties.isCollidable;
  }

  getGid() {
    return this.gid;
  }

  getPosition() {
    return this.position;
  }

  getTilesetPosition() {
    return this.tilesetPosition;
  }

  setTilesetPosition(position) {
    this.tilesetPosition = position;
  }

  getRect() {
    const p = this.getPosition();
    const s = this.getSize();
    return { x: p.x, y: p.y, width: s.width, height: s.height };
  }

  getSize() {
    return this.size;
  }

  setProperties(properties) {
    this.properties = properties;
  }
}
