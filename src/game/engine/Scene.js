import Audio from "./Audio";
import entities from "../entities";
import GameEvent from "./GameEvent";
import Graphics from "./Graphics";
import TiledMap from "./map/TiledMap";

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
    this.hero.setMap(this.map);
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

  getSize(s) {
    return this.size;
  }

  setSize(s) {
    this.size = s;
  }

  detectCollisions(entity) {
    const tile = this.map.getTileAt(entity.getOrigin());
    if (tile && tile.isDoorway() && entity.isHero()) {
      return GameEvent.fire(GameEvent.DOORWAY, tile);
    }

    this.entities.forEach(nextEntity => {
      if (entity.getId() === nextEntity.getId()) {
        return;
      }
      const isOneMoving =
        entity.getVelocity().magnitude() ||
        nextEntity.getVelocity().magnitude();
      const doesOneHaveIntent = entity.hasIntent() || nextEntity.hasIntent();
      const shouldHandleCollision = isOneMoving || doesOneHaveIntent;
      if (shouldHandleCollision && entity.intersects(nextEntity)) {
        entity.handleEvent(GameEvent.collision(nextEntity));
      }
    });
  }

  async init() {
    if (this.map) {
      await this.map.init();
      this.map.getEntities().forEach(tile => {
        const entity = entities.create(
          tile.getPosition(),
          tile.getProperties()
        );
        this.addEntity(entity);
      });
    }
    const promises = [];
    this.getEntities().forEach(entity => promises.push(entity.init()));
    const music = this.getBackgroundMusic();
    if (music) {
      Audio.play(music);
    }
    await Promise.all(promises);
  }

  onClick(position) {
    GameEvent.fire(GameEvent.DIALOG, "");
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

  update() {
    this.map.trackEntities(this.entities);
    this.entities.forEach(entity => {
      entity.update();
      this.detectCollisions(entity);
    });
  }

  unload() {
    this.hero.stop();
  }
}
