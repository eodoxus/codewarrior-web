export default class Size {
  static scale(size, factor) {
    return new Size(size.width, size.height).scale(factor);
  }

  width;
  height;

  constructor(width, height) {
    this.height = height;
    this.width = width;
  }

  scale(factor) {
    if (typeof factor === "number") {
      this.width *= factor;
      this.height *= factor;
    } else {
      this.width *= factor.width;
      this.height *= factor.height;
    }
    return this;
  }
}
