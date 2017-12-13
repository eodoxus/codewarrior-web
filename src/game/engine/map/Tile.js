import Rect from "../Rect";
import Vector from "../Vector";

export default class Tile {
  static OBJECT_TYPES = {
    COLLECTABLE: "collectable",
    COLLIDABLE: "collidable",
    DOORWAY: "doorway",
    TRANSITION: "transition"
  };

  static PROPERTIES = {
    ANIMATION: "animation",
    BEHAVIOR: "behavior",
    DIALOG: "dialog",
    ENTITY: "entity",
    FACING: "facing",
    FPS: "fps",
    FRAME_SET: "frame_set",
    GRAPHICS: "graphics",
    HEIGHT: "height",
    MOVEMENT: "movement",
    NAME: "name",
    NPC: "npc",
    SPAWN_HERO: "spawn_hero",
    WIDTH: "width"
  };

  static getOrigin(position, size) {
    return new Rect(
      position.x,
      position.y,
      size.width,
      size.height
    ).getOrigin();
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

  getEntity() {
    return this.entity;
  }

  setEntity(entity) {
    this.entity = entity;
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
    return new Rect(p.x, p.y, s.width, s.height);
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

  hasNpc() {
    return this.entity && this.entity.isNpc();
  }

  intersects(tile) {
    return tile.getRect ? this.intersectsTile(tile) : this.intersectsRect(tile);
  }

  intersectsTile(tile) {
    return this.getRect().intersects(tile.getRect());
  }

  intersectsRect(rect) {
    return this.getRect().intersects(rect);
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
    if (this.hasNpc()) {
      return false;
    }
    return true;
  }

  setProperties(properties) {
    this.properties = properties;
  }
}
