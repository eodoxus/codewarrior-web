import * as pako from "pako";
import Graphics from "../../engine/Graphics";
import Rect from "../Rect";
import RestClient from "../../../lib/RestClient";
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
  size;
  entities;
  properties;
  texture;
  tileSize;

  constructor(name) {
    this.name = name;
    this.entities = [];
    this.layers = [];
    this.properties = {};
  }

  addEntity(entity) {
    const exists = this.entities.some(tile => {
      return (
        tile.getProperty(Tile.PROPERTIES.NAME) ===
        entity.getProperty(Tile.PROPERTIES.NAME)
      );
    });
    if (!exists) {
      this.entities.push(entity);
    }
  }

  getAdjascentSceneNames() {
    const sceneNames = [];
    for (let iDx = this.layers.length - 1; iDx >= 0; iDx--) {
      const tiles = this.layers[iDx].getTiles();
      for (let jDx = 0; jDx < tiles.length; jDx++) {
        const tile = tiles[jDx];
        if (tile.isDoorway() || tile.isTransition()) {
          const sceneName = tile.getSceneName();
          if (!sceneNames.includes(sceneName)) {
            sceneNames.push(sceneName);
          }
        }
      }
    }
    return sceneNames;
  }

  getEntities() {
    return this.entities;
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

  getProperties() {
    return this.properties;
  }

  setProperties(properties) {
    this.properties = properties;
  }

  getProperty(name) {
    return this.properties[name];
  }

  setProperty(name, value) {
    this.properties[name] = value;
  }

  getSize() {
    return this.size;
  }

  getTexture() {
    return this.texture;
  }

  getTileAt(position) {
    const point = Rect.point(position);
    for (let iDx = this.layers.length - 1; iDx >= 0; iDx--) {
      const tiles = this.layers[iDx].getTiles();
      for (let jDx = 0; jDx < tiles.length; jDx++) {
        const tile = tiles[jDx];
        if (tile.intersects(point)) {
          return tile;
        }
      }
    }
  }

  getClosestWalkableTile(position) {
    let min = new Vector(this.size.width, this.size.height).magnitude();
    let tile;
    for (let iDx = this.layers.length - 1; iDx >= 0; iDx--) {
      const tiles = this.layers[iDx].getTiles();
      for (let jDx = 0; jDx < tiles.length; jDx++) {
        if (!tiles[jDx].isWalkable()) {
          continue;
        }
        const tilePosition = tiles[jDx].getPosition();
        const distance = tilePosition.distanceTo(position);
        if (distance.magnitude() < min) {
          tile = tiles[jDx];
          min = distance.magnitude();
        }
      }
    }
    return tile;
  }

  getTileSize() {
    return this.tileSize;
  }

  async init() {
    const tmxConfig = await new RestClient().get(
      Url.MAPS + this.name + ".json"
    );
    this.loadTMXConfig(tmxConfig);
    await TextureCache.fetch(this.texture);
  }

  loadTMXConfig(tmxConfig) {
    if (!tmxConfig.tilesets) {
      return;
    }
    const tileset = tmxConfig.tilesets[0];
    this.properties = tmxConfig.properties;
    this.texture = Url.MAPS + tileset.image;
    this.size = new Size(tileset.imagewidth, tileset.imageheight);
    this.tileSize = new Size(tileset.tilewidth, tileset.tileheight);
    this.layers = parseTileLayers.call(this, tmxConfig.layers);
    this.size = new Size(tmxConfig.width, tmxConfig.height).scale(
      this.tileSize
    );
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
      layer.getTiles().forEach(tile => {
        this.renderTile(tile);
      });
      Graphics.drawBuffer();
      TextureCache.put(textureName, Graphics.closeBuffer());
    }
  }

  renderTile(tile) {
    Graphics.drawTexture(
      TextureCache.get(this.texture),
      this.getTileSize(),
      tile.getTilesetPosition(),
      tile.getPosition()
    );

    if (Graphics.debug) {
      this.renderTileDebug(tile);
    }
  }

  renderTileDebug(tile) {
    Graphics.drawPoint(Tile.getOrigin(tile.getPosition(), this.getTileSize()));
    //Graphics.drawRect(tile.getRect());

    if (!tile.isWalkable()) {
      Graphics.colorize(tile.getRect(), "red");
    }
    if (tile.isDoorway()) {
      Graphics.colorize(tile.getRect(), "blue");
    }
    if (tile.isTransition()) {
      Graphics.colorize(tile.getRect(), "green");
    }
    if (tile.isWater()) {
      Graphics.colorize(tile.getRect(), "yellow");
    }
  }

  toTileCoord(position) {
    const x = Math.floor(position.x / this.getTileSize().width);
    const y = Math.floor(
      (this.size.height - position.y) / this.getTileSize().height
    );
    return new Vector(x, y);
  }

  trackEntities(entities) {
    this.layers.forEach(layer => {
      layer.getTiles().forEach(tile => {
        tile.clear();
        entities.forEach(entity => {
          if (tile.intersects(entity)) {
            tile.setEntity(entity);
          }
        });
      });
    });
  }
}

function parseTileLayers(tmxLayers) {
  const layers = [];
  const tileLayers = [];
  let objects = [];
  let collidableLayer = {};
  let waterLayer;

  // Separate object layers and tile layers.
  tmxLayers.forEach(layer => {
    if (layer.type === TiledMapLayer.LAYER_TYPE_OBJECT) {
      objects = layer.objects;
    } else if (layer.type === TiledMapLayer.LAYER_TYPE_TILE) {
      tileLayers.push(layer);
    }
  });

  // Convert layer tiles to game tiles
  const mapWidth = this.size.width;
  const tileWidth = this.tileSize.width;
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
      const tile = new Tile(position, this.tileSize, gid);
      tile.setTilesetPosition(tilesetPosition);
      tmLayer.addTile(tile);
    });

    // Save collidable and water layers for setting tile properties later
    if (layer.name === TiledMapLayer.LAYER_TYPE_COLLIDABLE) {
      collidableLayer = tmLayer;
    } else if (layer.name === TiledMapLayer.LAYER_TYPE_WATER) {
      waterLayer = tmLayer;
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
          waterLayer && waterLayer.getTiles(),
          objects
        )
      );
    });
  });

  // Extract entities
  parseObjects.call(this, objects);

  return layers;
}

function parseObjects(objects) {
  const routes = {};
  objects.forEach(object => {
    let tile = new Tile(
      new Vector(object.x, object.y),
      new Size(object.width, object.height)
    );
    switch (object.type) {
      case Tile.PROPERTIES.SPAWN_HERO:
        this.heroSpawnPoint = new Vector(object.x, object.y);
        break;
      case Tile.PROPERTIES.ENTITY:
        const properties = {};
        properties[Tile.PROPERTIES.NAME] = object.name;
        properties[Tile.PROPERTIES.WIDTH] = object.width;
        properties[Tile.PROPERTIES.HEIGHT] = object.height;
        Object.assign(properties, object.properties);
        tile.setProperties(properties);
        this.addEntity(tile);
        break;
      case Tile.PROPERTIES.ROUTE:
        routes[object.name] = parseRoute(object);
        break;
      default:
        break;
    }
  });

  if (!Object.keys(routes).length) {
    return;
  }

  // Assign routes to their proper entity
  this.entities.forEach(entity => {
    const routeName = entity.getProperty(Tile.PROPERTIES.ROUTE);
    if (routeName) {
      entity.setProperty(Tile.PROPERTIES.ROUTE, routes[routeName]);
    }
  });
}

function parseRoute(route) {
  return route.polyline.map(
    point => new Vector(point.x + route.x, point.y + route.y)
  );
}

function parseTileProperties(tile, collidableTiles, waterTiles, objects) {
  const properties = {};

  collidableTiles.forEach(collidable => {
    if (tile.intersects(collidable)) {
      properties.isCollidable = true;
    }
  });

  if (waterTiles) {
    waterTiles.forEach(water => {
      if (tile.intersects(water)) {
        properties.isWater = true;
      }
    });
  }

  objects.forEach(object => {
    let objectTile = new Tile(
      new Vector(object.x, object.y),
      new Size(object.width, object.height)
    );
    if (tile.intersects(objectTile)) {
      switch (object.type) {
        case Tile.OBJECT_TYPES.COLLIDABLE:
          properties.isCollidable = true;
          Object.assign(properties, object.properties);
          break;
        case Tile.OBJECT_TYPES.DOORWAY:
          properties.isDoorway = true;
          Object.assign(properties, object.properties);
          break;
        case Tile.OBJECT_TYPES.TRANSITION:
          properties.isTransition = true;
          Object.assign(properties, object.properties);
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
