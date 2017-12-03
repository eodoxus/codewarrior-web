import Audio from "./Audio";
import entities from "../entities";
import Event from "../../lib/Event";
import Graphics from "./Graphics";
import Hero from "../entities/hero/Hero";
import Tile from "./map/Tile";
import TiledMap from "./map/TiledMap";

export default class Scene {
  clickedTile;
  name;
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
    return this.name;
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
      return Event.fire(Event.DOORWAY, tile);
    }

    this.entities.forEach(nextEntity => {
      if (entity.getId() === nextEntity.getId()) {
        return;
      }
      if (
        (entity.getVelocity().magnitude() ||
          nextEntity.getVelocity().magnitude()) &&
        entity.intersects(nextEntity)
      ) {
        entity.handleCollision(nextEntity);
      }
    });
  }

  async loadAssets() {
    if (this.map) {
      await this.map.loadAssets();
      this.map.getEntities().forEach(tile => {
        const entityName = tile.getProperty(Tile.PROPERTIES.ENTITY);
        if (!entities[entityName]) {
          throw new Error(`Entity ${entityName} does not exist`);
        }
        const entity = new entities[entityName](
          tile.getProperty(Tile.PROPERTIES.NAME),
          tile.getPosition()
        );
        entity.setProperties(tile.getProperties());
        this.entities.push(entity);
      });
    }
    const promises = [];
    this.getEntities().forEach(entity => promises.push(entity.loadAssets()));
    const music = this.getBackgroundMusic();
    if (music) {
      Audio.play(music);
    }
    await Promise.all(promises);
  }

  onClick(position) {
    this.clickedPosition = position;
    this.clickedTile = this.map.getTileAt(position);
    if (this.clickedTile && this.clickedTile.isWalkable()) {
      this.hero.walkTo(this.clickedTile);
    }
  }

  render() {
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
    this.entities.forEach(entity => entity.render());
  }

  renderDebug() {
    return this.entities.map(entity => entity.renderDebug());
  }

  shouldShowBorder() {
    return this.showBorder;
  }

  spawnHero(position, direction) {
    if (!position) {
      position = this.map.getHeroSpawnPoint();
    }
    this.hero.setPosition(position);
    if (direction) {
      this.hero.getSprite().pickAnimation(Hero.STATES.WALKING, direction);
    }
  }

  update(dt) {
    this.map.trackEntities(this.entities);
    this.entities.forEach(entity => {
      entity.update(dt);
      this.detectCollisions(entity);
    });
  }

  unload() {
    this.hero.stop();
  }
}
