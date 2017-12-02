import Vector from "../Vector";
import Size from "../Size";

export default class Tile {
  static OBJECT_TYPES = {
    COLLECTABLE: "collectable",
    COLLIDABLE: "collidable",
    DOORWAY: "doorway",
    TRANSITION: "transition"
  };
  static PROPERTIES = {
    ENEMY: "enemy",
    ENTITY: "entity",
    FACING: "facing",
    NAME: "name",
    NPC: "npc",
    SPAWN_HERO: "spawn_hero"
  };

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
  entity;
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

  clear() {
    delete this.entity;
  }

  getGid() {
    return this.gid;
  }

  getPosition() {
    return this.position;
  }

  getProperty(name) {
    switch (name) {
      case Tile.PROPERTIES.FACING:
        if (this.properties[name + "_x"] && this.properties[name + "_y"]) {
          return new Vector(
            this.properties[name + "_x"],
            this.properties[name + "_y"]
          );
        }
        break;
      case Tile.PROPERTIES.SPAWN_HERO:
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

  getProperties() {
    return this.properties;
  }

  getRect() {
    const p = this.getPosition();
    const s = this.getSize();
    return { x: p.x, y: p.y, width: s.width, height: s.height };
  }

  getSize() {
    return this.size;
  }

  getTilesetPosition() {
    return this.tilesetPosition;
  }

  setTilesetPosition(position) {
    this.tilesetPosition = position;
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
    if (this.properties.isCollidable) {
      return false;
    }
    if (this.entity && (this.entity.isNpc() || this.entity.isEnemy())) {
      return false;
    }
    return true;
  }

  setEntity(entity) {
    this.entity = entity;
  }

  setProperties(properties) {
    this.properties = properties;
  }
}
