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
    BACKGROUND_MUSIC: "backgroundMusic",
    BEHAVIOR: "behavior",
    DIALOG: "dialog",
    ENTITY: "entity",
    FPS: "fps",
    FRAME_SET: "frameSet",
    GRAPHICS: "graphics",
    HEIGHT: "height",
    JUMPABLE: "jumpable",
    MOVEMENT: "movement",
    NAME: "name",
    NPC: "npc",
    OFFSET_X: "offsetX",
    OFFSET_Y: "offsetX",
    ORIENTATION: "orientation",
    SHOW_BORDER: "showBorder",
    SPAWN_HERO: "spawnHero",
    SPRITE_COLLECTION: "spriteCollection",
    TEXTURE: "texture",
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
  outline;
  position;
  properties;
  size;
  tilesetPosition;

  constructor(position, size, gid = 0, properties = {}) {
    this.position = position;
    this.size = size;
    this.gid = gid;
    this.properties = properties;
    this.outline = generateOutline(this);
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

  getOrigin() {
    return Tile.getOrigin(this.position, this.size);
  }

  getOutline() {
    return this.outline;
  }

  getPosition() {
    return this.position;
  }

  getProperty(name) {
    switch (name) {
      case Tile.PROPERTIES.ORIENTATION:
        if (this.properties[name + "X"] && this.properties[name + "Y"]) {
          return new Vector(
            parseInt(this.properties[name + "X"], 10),
            parseInt(this.properties[name + "Y"], 10)
          );
        }
        break;
      case Tile.PROPERTIES.SPAWN_HERO:
        if (this.properties[name + "X"] && this.properties[name + "Y"]) {
          return new Vector(
            parseInt(this.properties[name + "X"], 10),
            parseInt(this.properties[name + "Y"], 10)
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

  hasEntity() {
    return !!this.entity && !this.entity.isHero() && !this.entity.isDead();
  }

  hasNpc() {
    return this.hasEntity() && this.entity.isNpc();
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

  isJumpable() {
    const jumpable = Tile.PROPERTIES.JUMPABLE;
    if (this.hasEntity()) {
      return !!this.entity.getProperty(jumpable);
    }
    return !!this.properties[jumpable];
  }

  isTransition() {
    return this.properties.isTransition;
  }

  isWalkable() {
    if (this.properties.isCollidable) {
      return false;
    }
    if (this.hasEntity()) {
      return this.entity.isWalkable();
    }
    return true;
  }

  setProperties(properties) {
    this.properties = properties;
  }
}

function generateOutline(tile) {
  const rows = [];
  for (let y = tile.position.y; y < tile.position.y + tile.size.height; y++) {
    rows[y] = {
      start: tile.position.x,
      end: tile.position.x + tile.size.width
    };
  }
  return {
    rows,
    rect: new Rect(
      tile.position.x,
      tile.position.y,
      tile.size.width,
      tile.size.height
    )
  };
}
