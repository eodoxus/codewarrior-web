export default class Vector {
  static add(v, addend) {
    return _vectorOperation(v, "add", addend);
  }

  static subtract(v, subtrahend) {
    return _vectorOperation(v, "subtract", subtrahend);
  }

  static multiply(v, factor) {
    return _vectorOperation(v, "multiply", factor);
  }

  static divide(v, quotient) {
    return _vectorOperation(v, "divide", quotient);
  }

  static normalize(v) {
    return _vectorOperation(v, "normalize");
  }

  static round(v) {
    return _vectorOperation(v, "round");
  }

  static copy(v) {
    return new Vector(v.x, v.y);
  }

  x;
  y;

  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  abs(v) {
    this.x = Math.abs(this.x);
    this.y = Math.abs(this.y);
    return this;
  }

  add(v) {
    if (typeof v === "number") {
      this.x += v;
      this.y += v;
    } else {
      this.x += v.x;
      this.y += v.y;
    }
    return this.toFixed();
  }

  subtract(v) {
    if (typeof v === "number") {
      this.x -= v;
      this.y -= v;
    } else {
      this.x -= v.x;
      this.y -= v.y;
    }
    return this.toFixed();
  }

  multiply(v) {
    if (typeof v === "number") {
      this.x *= v;
      this.y *= v;
    } else {
      this.x *= v.x;
      this.y *= v.y;
    }
    return this.toFixed();
  }

  divide(v) {
    if (typeof v === "number") {
      this.x /= v;
      this.y /= v;
    } else {
      this.x /= v.x;
      this.y /= v.y;
    }
    return this.toFixed();
  }

  limit(max) {
    if (this.magnitude() > max) {
      this.normalize();
      this.multiply(max);
    }
    return this;
  }

  magnitude() {
    return parseFloat(
      Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)).toFixed(2)
    );
  }

  distanceTo(v) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  normalize() {
    const magnitude = this.magnitude();
    if (magnitude !== 0) {
      this.divide(magnitude);
    }
    return this.toFixed();
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  isEqual(v) {
    return this.x === v.x && this.y === v.y;
  }

  toFixed() {
    this.x = parseFloat(this.x.toFixed(2));
    this.y = parseFloat(this.y.toFixed(2));
    return this;
  }
}

function _vectorOperation(v, op, arg) {
  const out = new Vector(v.x, v.y);
  out[op](arg);
  return out;
}
