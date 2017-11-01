export default class Vector {
  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getMagnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  divide(quotient) {
    return new Vector(
      quotient > 0 ? this.x / quotient : 0,
      quotient > 0 ? this.y / quotient : 0
    );
  }

  normalize() {
    return this.divide(this.getMagnitude());
  }
}
