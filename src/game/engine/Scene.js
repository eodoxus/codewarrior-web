export default class Scene {
  backgroundImage;
  map;
  size;
  sprites;

  constructor(sprites) {
    this.sprites = sprites;
  }

  getBackgroundImage() {
    return this.backgroundImage;
  }

  getMap() {
    return this.map;
  }

  getSprites() {
    return this.sprites;
  }

  getSize(s) {
    return this.size;
  }

  setSize(s) {
    this.size = s;
  }

  handleCollisions(sprite) {}

  onClick(x, y) {
    console.log("scene click", x, y);
  }

  render() {
    if (this.map) {
      this.map.render();
    }
    this.sprites.forEach(sprite => sprite.render());
  }

  renderDebug() {
    return this.sprites.map(sprite => sprite.renderDebug());
  }

  update(dt) {
    this.sprites.forEach(sprite => {
      sprite.update(dt);
      this.handleCollisions(sprite);
    });
  }
}
