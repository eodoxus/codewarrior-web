import Event from "../../lib/Event";
import Graphics from "./Graphics";
import TiledMap from "./map/TiledMap";
import Hero from "../entities/hero/Hero";

export default class Scene {
  clickedTile;
  name;
  hero;
  map;
  size;
  entities;

  constructor(hero) {
    this.hero = hero;
    this.map = new TiledMap(this.getName());
    this.hero.setMap(this.map);
    this.entities = [hero];
  }

  getName() {
    // Override this
    return this.name;
  }

  getMap() {
    return this.map;
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

  handleCollisions(entity) {
    if (entity.id === Hero.ID) {
      const tile = this.map.getTileAt(this.hero.getOrigin());
      if (tile && tile.isDoorway()) {
        Event.fire(Event.TRANSITION, tile);
      }
    }
  }

  async loadAssets() {
    if (this.map) {
      await this.map.loadAssets();
    }
    const promises = [];
    this.getEntities().forEach(entity => promises.push(entity.loadAssets()));
    await Promise.all(promises);
  }

  onClick(position) {
    this.clickedTile = this.map.getTileAt(position);
    if (this.clickedTile && this.clickedTile.isWalkable()) {
      this.hero.walkTo(this.clickedTile);
    }
  }

  render() {
    if (this.map) {
      this.map.render();

      if (this.clickedTile && Graphics.debug) {
        Graphics.colorize(this.clickedTile.getRect(), "black");
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
      this.hero
        .getSprite()
        .updateCurrentAnimation(Hero.STATES.WALKING, direction);
    }
  }

  update(dt) {
    this.entities.forEach(entity => {
      entity.update(dt);
      this.handleCollisions(entity);
    });
  }

  unload() {
    this.hero.stop();
  }
}
