import * as pako from "pako";
import Graphics from "../../engine/Graphics";
import Size from "../Size";
import Tile from "./Tile";
import TiledMapLayer from "./TiledMapLayer";
import TextureCache from "../../engine/TextureCache";
import Url from "../../../lib/Url";
import Vector from "../Vector";

export default class TiledMap {
  name;
  heroSpawnPoint;
  layers;
  renderer;

  constructor(name, tmxConfig) {
    this.name = name;
    parseTMX.call(this, tmxConfig);
  }

  getHeroSpawnPoint() {
    return this.heroSpawnPoint;
  }

  getLayers() {
    return this.layers;
  }

  getName() {
    return this.name;
  }

  getTilesetTexture() {
    return this.tileset.texture;
  }

  getTileSize() {
    return this.tileset.tileSize;
  }

  render() {
    this.layers.forEach(layer => {
      this.renderLayer(layer);
    });
  }

  renderLayer(layer) {
    const textureName = "layer-" + layer.id;
    const texture = TextureCache.get(textureName);
    if (texture) {
      const size = new Size(texture.width, texture.height);
      const position = new Vector(0, 0);
      Graphics.drawTexture(texture, size, position, position);
    } else {
      Graphics.openBuffer();
      layer.tiles.forEach(tile => {
        this.renderTile(tile);
      });
      Graphics.drawBuffer();
      TextureCache.put(textureName, Graphics.closeBuffer());
    }
  }

  renderTile(tile) {
    Graphics.drawTexture(
      TextureCache.get(this.getTilesetTexture()),
      this.getTileSize(),
      tile.getTilesetPosition(),
      tile.getPosition()
    );

    if (!tile.isWalkable()) {
      //Graphics.colorize(tile.getRect(), "red");
    }
    if (tile.isDoorway()) {
      //Graphics.colorize(tile.getRect(), "blue");
    }
    if (tile.isTransition()) {
      //Graphics.colorize(tile.getRect(), "green");
    }
  }
}

function parseTMX(config) {
  const tileset = config.tilesets[0];
  this.tileset = {
    texture: Url.PUBLIC + tileset.image.substr(tileset.image.indexOf("/maps")),
    size: new Size(tileset.imagewidth, tileset.imageheight),
    tileSize: new Size(tileset.tilewidth, tileset.tileheight)
  };

  this.layers = parseTileLayers.call(this, config);
}

function parseTileLayers(config) {
  const layers = [];
  const tileLayers = [];
  let objects = [];
  let collidableLayer = {};

  // Separate object layers and tile layers.
  config.layers.forEach(layer => {
    if (layer.type === TiledMapLayer.LAYER_TYPE_OBJECT) {
      objects = layer.objects;
    } else if (layer.type === TiledMapLayer.LAYER_TYPE_TILE) {
      tileLayers.push(layer);
    }
  });

  // Convert layer tiles to game tiles
  const mapWidth = this.tileset.size.width;
  const tileWidth = this.tileset.tileSize.width;
  tileLayers.forEach(layer => {
    const tmLayer = new TiledMapLayer(
      this.name + "-" + layer.name,
      layer.name,
      new Size(layer.width, layer.height)
    );

    unpackTileGids(layer.data).forEach((gid, iDx) => {
      if (!gid) {
        return;
      }

      gid--;
      const position = new Vector(
        (iDx % layer.width) * tileWidth,
        Math.floor(iDx / layer.width) * tileWidth
      );
      const tilesetPosition = new Vector(
        (gid % (mapWidth / tileWidth)) * tileWidth,
        Math.floor(gid / (mapWidth / tileWidth)) * tileWidth
      );
      const tile = new Tile(gid, position, this.tileset.tileSize);
      tile.setTilesetPosition(tilesetPosition);
      tmLayer.addTile(tile);
    });

    // Save collidable layer for setting tile properties later
    if (layer.name === TiledMapLayer.LAYER_TYPE_COLLIDABLE) {
      collidableLayer = tmLayer;
    } else if (layer.visible) {
      layers.push(tmLayer);
    }
  });

  // Set properties for layer tiles
  layers.forEach(layer => {
    layer.tiles.forEach(tile => {
      tile.setProperties(
        parseTileProperties.call(
          this,
          tile,
          collidableLayer.getTiles(),
          objects
        )
      );
    });
  });

  return layers;
}

function parseTileProperties(tile, collidableTiles, objects) {
  const properties = {};

  collidableTiles.forEach(collidable => {
    if (tile.intersects(collidable)) {
      properties.isCollidable = true;
    }
  });

  objects.forEach(object => {
    if (object.type === Tile.OBJECT_TYPE_SPAWN_HERO) {
      this.heroSpawnPoint = new Vector(object.x, object.y);
      return;
    }

    let objectTile = new Tile(
      0,
      new Vector(object.x, object.y),
      new Size(object.width, object.height)
    );
    if (tile.intersects(objectTile)) {
      switch (object.type) {
        case Tile.OBJECT_TYPE_DOORWAY:
          properties.isDoorway = true;
          break;
        case Tile.OBJECT_TYPE_TRANSITION:
          properties.isTransition = true;
          break;
        case Tile.OBJECT_TYPE_COLLECTABLE:
          properties.isCollectable = true;
          break;
        default:
          break;
      }
    }
  });

  return properties;
}

function unpackTileGids(data) {
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
