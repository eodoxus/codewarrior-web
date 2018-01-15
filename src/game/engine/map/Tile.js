import Rect from "../Rect";
import Vector from "../Vector";

export default class Tile {
  static OBJECT_TYPES = {
    COLLECTABLE: "collectable",
    COLLIDABLE: "collidable",
    DOORWAY: "doorway",
    TRANSITION: "transition",
    WATER: "water"
  };

  static PROPERTIES = {
    ANIMATION: "animation",
    BACKGROUND_MUSIC: "backgroundMusic",
    BEHAVIOR: "behavior",
    BREAKABLE: "breakable",
    DIALOG: "dialog",
    END: "end",
    ENTITY: "entity",
    ENEMY: "enemy",
    EXPERIENCE: "experience",
    FPS: "fps",
    FRAME_SET: "frameSet",
    GRAPHICS: "graphics",
    HEIGHT: "height",
    JUMPABLE: "jumpable",
    MOVEMENT: "movement",
    NAME: "name",
    NPC: "npc",
    ORIENTATION: "orientation",
    ROUTE: "route",
    SHOW_BORDER: "showBorder",
    SPAWN_HERO: "spawnHero",
    SPRITE_COLLECTION: "spriteCollection",
    TEXTURE: "texture",
    VELOCITY: "velocity",
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

  static parseProperty(properties, name) {
    const coordinateList = [
      Tile.PROPERTIES.END,
      Tile.PROPERTIES.ORIENTATION,
      Tile.PROPERTIES.SPAWN_HERO,
      Tile.PROPERTIES.VELOCITY
    ];
    if (coordinateList.includes(name)) {
      if (properties[name + "X"] && properties[name + "Y"]) {
        return new Vector(
          parseInt(properties[name + "X"], 10),
          parseInt(properties[name + "Y"], 10)
        );
      }
    }
    return properties[name];
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
    return Tile.parseProperty(this.properties, name);
  }

  setProperty(name, value) {
    this.properties[name] = value;
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

  getSceneName() {
    return this.getProperty("to");
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

  isBreakable() {
    const breakable = Tile.PROPERTIES.BREAKABLE;
    if (this.hasEntity()) {
      return !!this.entity.getProperty(breakable);
    }
    return !!this.properties[breakable];
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
    return !!this.properties[jumpable] || this.properties.isWater;
  }

  isTransition() {
    return this.properties.isTransition;
  }

  isWalkable() {
    if (this.properties.isCollidable) {
      return false;
    }
    if (this.properties.isWater) {
      return false;
    }
    if (this.hasEntity()) {
      return this.entity.isWalkable();
    }
    return true;
  }

  isWater() {
    return this.properties.isWater;
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
