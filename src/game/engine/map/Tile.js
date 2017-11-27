import Vector from "../Vector";
import Size from "../Size";

export default class Tile {
  static OBJECT_TYPE_COLLECTABLE = "collectable";
  static OBJECT_TYPE_COLLIDABLE = "collidable";
  static OBJECT_TYPE_DOORWAY = "doorway";
  static OBJECT_TYPE_TRANSITION = "transition";

  static PROPERTY_FACING = "facing";
  static PROPERTY_SPAWN_HERO = "spawn_hero";

  static getOrigin(position, size) {
    return Vector.add(
      position,
      new Vector(Math.floor(size.width / 2), Math.floor(size.height / 2))
    );
  }

  static point(position) {
    return new Tile(position, new Size(1, 1));
  }

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

  getGid() {
    return this.gid;
  }

  getPosition() {
    return this.position;
  }

  getProperty(name) {
    switch (name) {
      case Tile.PROPERTY_FACING:
        if (this.properties[name + "_x"] && this.properties[name + "_y"]) {
          return new Vector(
            this.properties[name + "_x"],
            this.properties[name + "_y"]
          );
        }
        break;
      case Tile.PROPERTY_SPAWN_HERO:
        if (this.properties[name + "_x"] && this.properties[name + "_y"]) {
          return new Vector(
            this.properties[name + "_x"],
            this.properties[name + "_y"]
          );
        }
        break;
      default:
        return this.properties[name];
    }
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

  setProperties(properties) {
    this.properties = properties;
  }
}
