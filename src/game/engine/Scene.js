import Audio from "./Audio";
import Entities from "../entities";
import GameEvent from "./GameEvent";
import GameState from "../GameState";
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

  soundEffects = [
    Audio.EFFECTS.CLOSE_BOOK,
    Audio.EFFECTS.JUMP,
    Audio.EFFECTS.JUMP_COLLIDE,
    Audio.EFFECTS.OPEN_BOOK,
    Audio.EFFECTS.OUT_OF_MAGIC
  ];

  constructor(mapName, hero) {
    Audio.stop();
    this.hero = hero;
    this.map = new TiledMap(mapName);
    this.entities = [hero];
  }

  addEntity(entity) {
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
    const song = this.map.getProperty(Tile.PROPERTIES.BACKGROUND_MUSIC);
    if (song) {
      return `music/${song}.ogg`;
    }
  }

  getName() {
    return this.map.getProperty(Tile.PROPERTIES.NAME);
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

  getEntities() {
    return this.entities;
  }

  detectCollisions() {
    let len = this.entities.length;
    for (let iDx = 0; iDx < len - 1; iDx++) {
      const entity = this.entities[iDx];
      if (entity.isDead) {
        continue;
      }

      for (let jDx = iDx + 1; jDx < len; jDx++) {
        const otherEntity = this.entities[jDx];
        if (otherEntity.isDead) {
          continue;
        }

        const isOneMoving =
          entity.getVelocity().magnitude() ||
          otherEntity.getVelocity().magnitude();
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
    this.loadSoundEffects();
    await this.initMap();
    this.startBackgroundMusic();
    await this.initEntities();
    GameState.restoreScene(this);
    GameState.setSceneApi(this.getApi());
  }

  async initEntities() {
    const promises = this.getEntities().map(entity => entity.init());
    await Promise.all(promises);
  }

  async initMap() {
    this.hero.setMap(this.map);
    await this.map.init();
    this.map.getEntities().forEach(tile => {
      const entity = Entities.create(tile.getPosition(), tile.getProperties());
      this.addEntity(entity);
    });
  }

  loadSoundEffects() {
    this.soundEffects.forEach(effect => Audio.load(effect));
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
      if (entity.isDead) {
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
    return this.map.getProperty(Tile.PROPERTIES.SHOW_BORDER);
  }

  startBackgroundMusic() {
    const music = this.getBackgroundMusic();
    if (music) {
      Audio.play(music);
    }
  }

  update() {
    this.map.trackEntities(this.entities);
    this.entities.forEach(entity => {
      entity.update();
    });

    this.detectCollisions();
  }

  unload() {
    this.hero.stop();
    GameEvent.fire(GameEvent.CLOSE_TATTERED_PAGE);
    GameState.storeScene(this);
    GameState.storeHero(this.hero);
  }
}
