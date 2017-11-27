import Graphics from "./Graphics";
import Size from "./Size";
import TextureCache from "./TextureCache";
import Tile from "./map/Tile";

export default class Sprite {
  id = "sprite-changeme";
  size;
  texture;

  constructor(id, size = new Size(100, 100), texture) {
    this.id = id;
    this.size = size;
    this.texture = texture;
  }

  getSize() {
    return this.size;
  }

  setSize(s) {
    this.size = s;
  }

  getTexture() {
    return this.texture;
  }

  setTexture(texture) {
    this.texture = texture;
  }

  async loadAssets() {
    await TextureCache.fetch(this.texture);
  }

  render(position) {
    const texture = this.getTexture();
    Graphics.drawTexture(
      texture.getImage(),
      texture.getSize(),
      texture.getPosition(),
      position,
      Graphics.debug ? 0.5 : 1.0
    );

    if (Graphics.debug) {
      const size = this.getSize();
      Graphics.drawRect(position, size);
      Graphics.drawPoint(Tile.getOrigin(position, size));
    }
  }
}
