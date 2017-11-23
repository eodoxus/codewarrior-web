import Graphics from "./Graphics";
import TextureCache from "./TextureCache";
import TiledMap from "./map/TiledMap";

export default class Scene {
  clickedTile;
  name;
  hero;
  map;
  size;
  entities;

  constructor(hero, entities = []) {
    this.hero = hero;
    this.entities = entities;
    this.map = new TiledMap(this.getName(), this.getMapConfig());
    this.hero.setMap(this.map);
    hero.setPosition(this.map.getHeroSpawnPoint());
    this.entities.unshift(hero);
  }

  getName() {
    // Override this
    return this.name;
  }

  getMap() {
    return this.map;
  }

  getMapConfig() {
    // Override this
    return {};
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

  handleCollisions(entity) {}

  loadAssets() {
    let textures = [];

    this.getEntities().forEach(object => {
      const sprite = object.getSprite();
      if (!sprite) {
        return;
      }
      textures = textures.concat(sprite.getTextures());
    });

    if (this.map) {
      const tilesetTexture = this.map.getTilesetTexture();
      if (tilesetTexture) {
        textures.push(tilesetTexture);
      }
    }

    return TextureCache.fetch(textures);
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

  update(dt) {
    this.entities.forEach(entity => {
      entity.update(dt);
      this.handleCollisions(entity);
    });
  }
}
