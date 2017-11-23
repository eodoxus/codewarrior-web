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

  x;
  y;

  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  add(v) {
    if (typeof v === "number") {
      this.x += v;
      this.y += v;
    } else {
      this.x += v.x;
      this.y += v.y;
    }
    return this;
  }

  subtract(v) {
    if (typeof v === "number") {
      this.x -= v;
      this.y -= v;
    } else {
      this.x -= v.x;
      this.y -= v.y;
    }
    return this;
  }

  multiply(v) {
    if (typeof v === "number") {
      this.x *= v;
      this.y *= v;
    } else {
      this.x *= v.x;
      this.y *= v.y;
    }
    return this;
  }

  divide(v) {
    if (typeof v === "number") {
      this.x /= v;
      this.y /= v;
    } else {
      this.x /= v.x;
      this.y /= v.y;
    }
    return this;
  }

  limit(max) {
    if (this.magnitude() > max) {
      this.normalize();
      this.multiply(max);
    }
    return this;
  }

  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  diff(v) {
    return new Vector(
      Math.abs(Math.abs(this.x) - Math.abs(v.x)),
      Math.abs(Math.abs(this.y) - Math.abs(v.y))
    );
  }

  normalize() {
    const magnitude = this.magnitude();
    if (magnitude !== 0) {
      this.divide(magnitude);
      this.x = Math.abs(this.x);
      this.y = Math.abs(this.y);
    }
    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }

  render() {
    return Math.round(this.x) + ", " + Math.round(this.y);
  }
}

function _vectorOperation(v, op, arg) {
  const out = new Vector(v.x, v.y);
  out[op](arg);
  return out;
}
