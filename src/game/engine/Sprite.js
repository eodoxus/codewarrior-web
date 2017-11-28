import Graphics from "./Graphics";
import Size from "./Size";
import TextureCache from "./TextureCache";
import Tile from "./map/Tile";
import Vector from "./Vector";

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

  intersects(position) {
    // Find the texture's pixel at position. If it is
    // not transparent, then we have an intersection.
    Graphics.openBuffer();
    const tex = this.getTexture();
    Graphics.drawTexture(
      tex.getImage(),
      tex.getSize(),
      tex.getPosition(),
      new Vector(0, 0)
    );
    const pixelPosition = Vector.subtract(position, this.position);
    const pixel = Graphics.getPixel(pixelPosition);
    Graphics.closeBuffer();
    return !Graphics.isTransparent(pixel);
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
      const size = texture.getSize();
      Graphics.drawRect(position, size);
      Graphics.drawPoint(Tile.getOrigin(position, size));
    }
  }
}
