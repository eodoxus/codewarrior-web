export default class Size {
  static scale(size, factor) {
    return new Size(size.width * factor, size.height * factor);
  }

  height;
  width;

  constructor(width, height) {
    this.height = height;
    this.width = width;
  }

  scale(factor) {
    this.height *= factor;
    this.width *= factor;
  }
}
