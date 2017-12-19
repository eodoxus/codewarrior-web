import Audio from "./Audio";
import entities from "../entities";
import GameEvent from "./GameEvent";
import Graphics from "./Graphics";
import TiledMap from "./map/TiledMap";
import GameState from "../GameState";

export default class Scene {
  clickedTile;
  hero;
  map;
  size;
  entities;

  constructor(hero) {
    Audio.stop();
    this.hero = hero;
    this.map = new TiledMap(this.getName());
    this.entities = [hero];
  }

  addEntity(entity) {
    this.entities.push(entity);
  }

  getBackgroundMusic() {
    // Override this
  }

  getName() {
    // Override this
    return "Base Scene";
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
      for (let jDx = iDx + 1; jDx < len; jDx++) {
        const otherEntity = this.entities[jDx];
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
    this.startBackgroundMusic();
    await this.initMap();
    await this.initEntities();
    GameState.restoreScene(this);
  }

  async initEntities() {
    const promises = this.getEntities().map(entity => entity.init());
    await Promise.all(promises);
  }

  async initMap() {
    this.hero.setMap(this.map);
    await this.map.init();
    this.map.getEntities().forEach(tile => {
      const entity = entities.create(tile.getPosition(), tile.getProperties());
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
      }
    }
  }

  renderEntities() {
    const renderOrder = {};
    this.entities.forEach(entity => {
      if (!renderOrder[entity.getZIndex()]) {
        renderOrder[entity.getZIndex()] = [];
      }
      renderOrder[entity.getZIndex()].push(entity);
    });
    Object.keys(renderOrder).forEach(iDx => {
      renderOrder[iDx].forEach(entity => {
        entity.render();
      });
    });
  }

  shouldShowBorder() {
    return this.showBorder;
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
