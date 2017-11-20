export default class TiledMapLayer {
  static LAYER_TYPE_COLLIDABLE = "collidable";
  static LAYER_TYPE_TILE = "tilelayer";
  static LAYER_TYPE_OBJECT = "objectgroup";

  id;
  name;
  tiles;

  constructor(id, name, size, tiles = []) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.tiles = tiles;
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getTileAt(position) {}

  addTile(tile) {
    this.tiles.push(tile);
  }

  getTiles() {
    return this.tiles;
  }
}
