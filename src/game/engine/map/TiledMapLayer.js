export default class TiledMapLayer {
  static LAYER_TYPE_COLLIDABLE = "collidable";
  static LAYER_TYPE_TILE = "tilelayer";
  static LAYER_TYPE_OBJECT = "objectgroup";
  static LAYER_TYPE_WATER = "water";

  id;
  name;
  size;
  tiles;

  constructor(id, name, size, tiles = []) {
    this.id = id;
    this.name = name;
    this.size = size;
    this.tiles = tiles;
  }

  addTile(tile) {
    this.tiles.push(tile);
  }

  getId() {
    return this.id;
  }

  getName() {
    return this.name;
  }

  getSize() {
    return this.size;
  }

  getTiles() {
    return this.tiles;
  }
}
