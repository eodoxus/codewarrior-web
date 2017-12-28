import GraphicsComponent from "./GraphicsComponent";
import Size from "../../../engine/Size";
import Sprite from "../../../engine/Sprite";
import Tile from "../../../engine/map/Tile";

export default class NoGraphicsComponent extends GraphicsComponent {
  size;

  static create(entity) {
    return new NoGraphicsComponent(entity);
  }

  constructor(entity) {
    super(entity);

    const width = entity.getProperty(Tile.PROPERTIES.WIDTH);
    const height = entity.getProperty(Tile.PROPERTIES.HEIGHT);
    const size = new Size(width, height);
    this.sprite = new Sprite(size);
    const outline = generateOutline(size);
    this.sprite.getOutline = () => outline;
  }

  init() {
    this._isReady = true;
  }

  render() {}
}

function generateOutline(size) {
  const rows = [];
  for (let iDx = 0; iDx < size.height; iDx++) {
    rows[iDx] = {
      start: 0,
      end: size.width
    };
  }
  return {
    min: 0,
    max: size.width,
    rows
  };
}
