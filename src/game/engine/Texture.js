import TextureCache from "./TextureCache";

export default class Texture {
  url;
  position;
  size;

  constructor(url, position, size) {
    this.url = url;
    this.position = position;
    this.size = size;
  }

  getImage() {
    return TextureCache.get(this.getUrl());
  }

  getPosition() {
    return this.position;
  }

  getSize() {
    return this.size;
  }

  getUrl() {
    return this.url;
  }
}
