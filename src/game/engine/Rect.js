import Vector from "./Vector";

export default class Rect {
  static point(position) {
    return new Rect(position.x, position.y, 1, 1);
  }

  x;
  y;
  width;
  height;

  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  getOrigin() {
    return Vector.add(
      this.getPosition(),
      new Vector(Math.floor(this.width / 2), Math.floor(this.height / 2))
    );
  }

  getPosition() {
    return new Vector(this.x, this.y);
  }

  getSize() {
    return this.size;
  }

  intersects(rect) {
    return (
      this.x < rect.x + rect.width &&
      this.x + this.width > rect.x &&
      this.y < rect.y + rect.height &&
      this.height + this.y > rect.y
    );
  }
}
