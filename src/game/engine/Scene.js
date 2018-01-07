import Entities from "../entities";
import GameEvent from "./GameEvent";
import Graphics from "./Graphics";
import SceneDirector from "./SceneDirector";
import Size from "./Size";
import Tile from "./map/Tile";
import TiledMap from "./map/TiledMap";
import Texture from "./Texture";
import TextureCache from "./TextureCache";
import Vector from "./Vector";

export default class Scene {
  clickedTile;
  entities;
  hero;
  map;

  constructor(mapName) {
    this.entities = [];
    this.map = new TiledMap(mapName);
  }

  addEntity(entity) {
    if (entity.isHero()) {
      this.hero = entity;
      return this.entities.unshift(entity);
    }
    this.entities.push(entity);
  }

  getApi() {
    const api = {};
    this.getEntities().forEach(entity => {
      const entityApi = entity.getApi();
      if (entityApi) {
        api[entity.getId()] = entityApi;
      }
    });
    return api;
  }

  getBackgroundMusic() {
    return this.map.getProperty(Tile.PROPERTIES.BACKGROUND_MUSIC);
  }

  getEntities() {
    return this.entities;
  }

  getMap() {
    return this.map;
  }

  setMap(map) {
    this.map = map;
    this.entities.forEach(entity => {
      entity.setMap(this.map);
    });
  }

  getName() {
    return this.map.getName();
  }

  detectCollisions() {
    let len = this.entities.length;
    for (let iDx = 0; iDx < len - 1; iDx++) {
      const entity = this.entities[iDx];
      if (entity.isDead()) {
        continue;
      }

      for (let jDx = iDx + 1; jDx < len; jDx++) {
        const otherEntity = this.entities[jDx];
        if (otherEntity.isDead()) {
          continue;
        }

        const isOneMoving =
          entity.getVelocity().magnitude() > 0 ||
          otherEntity.getVelocity().magnitude() > 0;
        const doesOneHaveIntent = entity.hasIntent() || otherEntity.hasIntent();
        const shouldHandleCollision = isOneMoving || doesOneHaveIntent;
        if (shouldHandleCollision && entity.intersects(otherEntity)) {
          entity.handleEvent(GameEvent.collision(otherEntity));
          otherEntity.handleEvent(GameEvent.collision(entity));
        }
      }
    }
  }

  async init() {
    await this.initMap();
    await this.initEntities();
  }

  async initEntities() {
    const promises = this.getEntities().map(entity => entity.init());
    await Promise.all(promises);
  }

  async initMap() {
    await this.map.init();
    this.map.getEntities().forEach(tile => {
      const entity = Entities.create(tile.getPosition(), tile.getProperties());
      this.addEntity(entity);
    });
  }

  onClick(position) {
    this.clickedPosition = position;
    this.clickedTile = this.map.getTileAt(position);
    if (this.clickedTile) {
      this.hero.handleEvent(GameEvent.click(this.clickedTile));
    }
  }

  render() {
    this.renderMap();
    this.renderEntities();
  }

  renderMap() {
    if (this.map) {
      this.map.render();

      if (Graphics.debug) {
        if (this.clickedPosition) {
          Graphics.drawPoint(this.clickedPosition);
        }
        if (this.clickedTile) {
          Graphics.colorize(this.clickedTile.getRect(), "black");
        }
        if (Graphics.debugTile) {
          Graphics.colorize(Graphics.debugTile.getRect(), "cyan");
        }
      }
    }
  }

  renderEntities() {
    const renderOrder = {};
    for (let iDx = this.entities.length - 1; iDx >= 0; iDx--) {
      const entity = this.entities[iDx];
      if (entity.isDead()) {
        continue;
      }
      const yPos = entity.getPosition().y;
      if (!renderOrder[yPos]) {
        renderOrder[yPos] = [];
      }
      renderOrder[yPos].push(entity);
    }
    Object.keys(renderOrder).forEach(iDx => {
      renderOrder[iDx].forEach(entity => {
        entity.render();
      });
    });
  }

  renderToTexture() {
    const name = this.getName() + "FrameTexture";
    Graphics.openBuffer();
    this.render();
    TextureCache.put(name, Graphics.closeBuffer());
    return new Texture(
      name,
      new Vector(),
      Size.scale(SceneDirector.SIZE, Graphics.getScale())
    );
  }

  removeEntity(entity) {
    const iDx = this.entities.findIndex(e => e === entity);
    if (iDx > -1) {
      this.entities.splice(iDx, 1);
    }
  }

  shouldShowBorder() {
    return !!this.map.getProperty(Tile.PROPERTIES.SHOW_BORDER);
  }

  update() {
    this.map.trackEntities(this.entities);
    this.entities.forEach(entity => {
      entity.update();
    });

    this.detectCollisions();
  }
}
