import Graphics from "./Graphics";
import Rect from "./Rect";
import RestClient from "../../lib/RestClient";
import Size from "./Size";
import Texture from "./Texture";
import TextureCache from "./TextureCache";
import Tile from "./map/Tile";
import Url from "../../lib/Url";
import Vector from "./Vector";

export default class Sprite {
  static create(properties) {
    const sprite = new Sprite();
    sprite.setProperties(properties);
    return sprite;
  }

  outline;
  properties;
  size;
  texture;

  constructor(size = new Size(100, 100), texture) {
    this.size = size;
    this.texture = texture;
  }

  getOutline() {
    return this.outline;
  }

  setProperties(properties) {
    this.properties = properties;
  }

  getSize() {
    return this.size;
  }

  setSize(size) {
    this.size = size;
    this.texture.setSize(size);
  }

  getTexture() {
    return this.texture;
  }

  setTexture(texture) {
    this.texture = texture;
  }

  intersects(position, spritePosition) {
    // Find the texture's pixel at position. If it is
    // not transparent, then we have an intersection.
    const pixelPosition = Vector.subtract(position, spritePosition);
    const pixel = getPixel(this.getTexture(), pixelPosition);
    return !Graphics.isTransparent(pixel);
  }

  async init() {
    if (this.properties) {
      const plistFile =
        Url.SPRITES +
        this.properties[Tile.PROPERTIES.SPRITE_COLLECTION] +
        ".json";
      const plist = await new RestClient().get(plistFile);
      const frame =
        plist.frames[this.properties[Tile.PROPERTIES.TEXTURE]].frame;
      const width = this.properties[Tile.PROPERTIES.WIDTH] || frame.w;
      const height = this.properties[Tile.PROPERTIES.HEIGHT] || frame.h;
      this.size = new Size(width, height);
      this.texture = new Texture(
        Url.SPRITES + plist.meta.image,
        new Vector(frame.x, frame.y),
        this.size
      );
    }
    await TextureCache.fetch(this.getTexture());
  }

  render(position) {
    if (!this.outline) {
      this.outline = generateOutline(this.getTexture());
    }

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
      Graphics.drawRect(
        new Rect(position.x, position.y, size.width, size.height)
      );
      Graphics.drawPoint(Tile.getOrigin(position, size));
    }
  }
}

function generateOutline(texture) {
  const size = texture.getSize();
  Graphics.openBuffer();
  Graphics.drawTexture(
    texture.getImage(),
    size,
    texture.getPosition(),
    new Vector(0, 0)
  );
  const rows = [];
  // Iterate all the non-transparent pixels. When the first
  // non-transparent pixel is found (on the left side), mark it
  // as "start". When the last non-transparent pixel is found
  // (on the right side), mark it as "end". At the end of the
  // search, we should have an array containing the left and right
  // non-transparent pixel positions for each row containing at
  // least 1 non-transparent pixel, i.e a data structure representing
  // the outline of the image.
  let min = 0;
  let max = 0;
  for (let y = 0; y < size.height; y++) {
    for (let x = 0; x < size.width; x++) {
      const pixel = Graphics.getPixel(new Vector(x, y));
      const isTransparent = Graphics.isTransparent(pixel);
      if (!rows[y] && !isTransparent) {
        rows[y] = {
          start: x
        };
        if (!min || x < min) {
          min = x;
        }
      } else if (rows[y] && !rows[y].end && isTransparent) {
        rows[y].end = x;
      }
      if (!max || x > max) {
        max = x;
      }
    }
    if (rows[y]) {
      if (!rows[y].end) {
        rows[y].end = rows[y].start;
      }
    }
  }
  Graphics.closeBuffer();
  return { min, max, rows };
}

function getPixel(texture, position) {
  Graphics.openBuffer();
  Graphics.drawTexture(
    texture.getImage(),
    texture.getSize(),
    texture.getPosition(),
    new Vector(0, 0)
  );
  const pixel = Graphics.getPixel(position);
  Graphics.closeBuffer();
  return pixel;
}
