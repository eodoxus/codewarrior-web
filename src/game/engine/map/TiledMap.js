import * as pako from "pako";
import Size from "../Size";
import Tile from "./Tile";
import TiledMapRenderer from "./TiledMapRenderer";
import Url from "../../../lib/Url";
import Vector from "../Vector";

const LAYER_TYPE_TILE = "tilelayer";

export default class TiledMap {
  name;
  config;
  heroSpawnPoint;
  width;
  height;
  layers;
  renderer;

  constructor(name, config) {
    this.name = name;
    parseConfig.call(this, config);
    this.renderer = new TiledMapRenderer(this);
  }

  initFromConfig(config) {
    this.heroSpawnPoint = new Vector(config.hero.x, config.hero.y);
  }

  getHeroSpawnPoint() {
    return this.heroSpawnPoint;
  }

  getLayers() {
    return this.layers;
  }

  getTileSize() {
    return this.tileSize;
  }

  getTilesetTexture() {
    return this.tileset.texture;
  }

  toTileCoord(position) {
    const tileSize = this.getTileSize();
    const x = Math.floor(position.x / tileSize.width);
    const y = Math.floor((this.height - position.y) / tileSize.height);
    return new Vector(x, y);
  }

  tileAt(position) {
    if (
      position.x < 0 ||
      position.x > this.width ||
      position.y < 0 ||
      position.y > this.height
    ) {
      return null;
    }
    const tileCoord = this.toTileCoord(position);
    const sprite = this._backgroundLayer.getTileAt(tileCoord);
    var gid = this._metaLayer.getTileGIDAt(tileCoord);
    var properties = this.getPropertiesForGID(gid);
    return new Tile(sprite, properties);
  }

  render() {
    this.renderer.render();
  }
}

function parseConfig(config) {
  const tileset = config.tilesets[0];
  this.tileset = {
    texture: Url.PUBLIC + tileset.image.substr(tileset.image.indexOf("/maps")),
    size: new Size(tileset.imagewidth, tileset.imageheight),
    tileSize: new Size(config.tilewidth, config.tileheight)
  };
  this.layers = [];
  config.layers.forEach(layer => {
    if (layer.type === LAYER_TYPE_TILE && layer.visible) {
      this.layers.push({
        id: this.name + "-" + layer.name,
        tiles: unpackTiles(layer.data),
        size: new Size(layer.width, layer.height)
      });
    }
  });
}

function unpackTiles(data) {
  const compressed = atob(data);
  const decompressed = pako.inflate(compressed);
  return uint8ArrayToUint32Array(decompressed);
}

function uint8ArrayToUint32Array(uint8Arr) {
  if (uint8Arr.length % 4 !== 0) return null;

  var arrLen = uint8Arr.length / 4;
  var retArr = window.Uint32Array ? new Uint32Array(arrLen) : [];
  for (var i = 0; i < arrLen; i++) {
    var offset = i * 4;
    retArr[i] =
      uint8Arr[offset] +
      uint8Arr[offset + 1] * (1 << 8) +
      uint8Arr[offset + 2] * (1 << 16) +
      uint8Arr[offset + 3] * (1 << 24);
  }
  return retArr;
}
