export default class Scene {
  static TILE_SIZE = 8;

  size;
  sprites;

  constructor(sprites) {
    this.sprites = sprites;
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

  render(context) {
    this.sprites.forEach(sprite => sprite.render(context));
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
