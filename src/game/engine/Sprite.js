import Graphics from "./Graphics";
import Size from "./Size";

export default class Sprite {
  id = "sprite";
  size;
  texture;

  constructor(size = new Size(100, 100)) {
    this.size = size;
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

  getTextures() {
    return [this.texture];
  }

  render(position) {
    const texture = this.getTexture();
    Graphics.drawTexture(
      texture.getImage(),
      texture.getSize(),
      texture.getPosition(),
      position
    );
  }
}
