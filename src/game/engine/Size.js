export default class Size {
  static scale(size, factor) {
    return new Size(size.width * factor, size.height * factor);
  }

  width;
  height;

  constructor(width, height) {
    this.height = height;
    this.width = width;
  }

  scale(factor) {
    this.width *= factor;
    this.height *= factor;
    return this;
  }
}
