import Vector from "./Vector";

let v;
beforeEach(function() {
  v = new Vector();
});

afterEach(function() {
  v = new Vector();
});

describe("Vector", () => {
  describe("add", () => {
    it("it accepts a scalar and adds it to each component", () => {
      v.add(2);
      expect(v.x).toBe(2);
      expect(v.y).toBe(2);
    });

    it("it accepts a vector and adds corresponding components", () => {
      v.add(new Vector(1, 2));
      expect(v.x).toBe(1);
      expect(v.y).toBe(2);
    });

    it("it fixes decimals at 2", () => {
      v.add(new Vector(1.12345, 2.67891));
      expect(v.x).toBe(1.12);
      expect(v.y).toBe(2.68);
    });
  });

  describe("subtract", () => {
    it("it accepts a scalar and subtracts it from each component", () => {
      v.subtract(2);
      expect(v.x).toBe(-2);
      expect(v.y).toBe(-2);
    });

    it("it accepts a vector and subtracts corresponding components", () => {
      v.subtract(new Vector(1, 2));
      expect(v.x).toBe(-1);
      expect(v.y).toBe(-2);
    });

    it("it fixes decimals at 2", () => {
      v.subtract(new Vector(1.12345, 2.67891));
      expect(v.x).toBe(-1.12);
      expect(v.y).toBe(-2.68);
    });
  });

  describe("multiply", () => {
    beforeEach(function() {
      v = new Vector(2, 3);
    });

    it("it accepts a scalar and multiplies it from each component", () => {
      v.multiply(2);
      expect(v.x).toBe(4);
      expect(v.y).toBe(6);
    });

    it("it accepts a vector and multiplies corresponding components", () => {
      v.multiply(new Vector(2, 3));
      expect(v.x).toBe(4);
      expect(v.y).toBe(9);
    });

    it("it fixes decimals at 2", () => {
      v.multiply(new Vector(1.12345, 2.67891));
      expect(v.x).toBe(2.25);
      expect(v.y).toBe(8.04);
    });
  });

  describe("divide", () => {
    beforeEach(function() {
      v = new Vector(2, 3);
    });

    it("it accepts a scalar and divides it from each component", () => {
      v.divide(2);
      expect(v.x).toBe(1);
      expect(v.y).toBe(1.5);
    });

    it("it accepts a vector and divides corresponding components", () => {
      v.divide(new Vector(2, 3));
      expect(v.x).toBe(1);
      expect(v.y).toBe(1);
    });

    it("it fixes decimals at 2", () => {
      v.divide(new Vector(1.12345, 2.67891));
      expect(v.x).toBe(1.78);
      expect(v.y).toBe(1.12);
    });

    it("allows user to generate a new vector using static round operation", () => {
      const v2 = Vector.divide(v, 2);
      expect(v2.x).toBe(1);
      expect(v2.y).toBe(1.5);
    });
  });

  describe("limit", () => {
    beforeEach(function() {
      v = new Vector(2, 3);
    });

    it("limits the magnitude of a vector by a scalar", () => {
      v.limit(0.9);
      expect(v.magnitude()).toBe(0.9);
    });

    it("does nothing if limit is more than vector's magnitude", () => {
      const magnitude = v.magnitude();
      v.limit(5);
      expect(v.magnitude()).toBe(magnitude);
    });

    it("it fixes decimals at 2 as a result of inner operations", () => {
      v.limit(0.88675);
      expect(v.x).toBe(0.49);
      expect(v.y).toBe(0.74);
    });
  });

  describe("magnitude", () => {
    it("calculates the length of the vector", () => {
      v = new Vector(2, 3).normalize();
      expect(v.magnitude()).toBe(1);
    });

    it("it fixes decimals at 2", () => {
      v = new Vector(2.25678, 3.87345);
      expect(v.magnitude()).toBe(4.48);
    });
  });

  describe("normalize", () => {
    it("limits the magnitude of a vector to 1", () => {
      v = new Vector(26, 30);
      v.normalize();
      expect(v.magnitude()).toBe(1);
    });

    it("does nothing if magnitude is 0", () => {
      v.normalize();
      expect(v.magnitude()).toBe(0);
    });

    it("it fixes decimals at 2", () => {
      v = new Vector(1, 3).normalize();
      expect(v.x).toBe(0.32);
      expect(v.y).toBe(0.95);
    });
  });

  describe("round", () => {
    it("rounds components to nearest integer", () => {
      v = new Vector(26.5, 30.5);
      v.round();
      expect(v.x).toBe(27);
      expect(v.y).toBe(31);

      v.x = 26.4;
      v.y = 30.4;
      v.round();
      expect(v.x).toBe(26);
      expect(v.y).toBe(30);
    });

    it("allows user to generate a new vector using static round operation", () => {
      v = new Vector(26.5, 30.5);
      const v2 = Vector.round(v);
      expect(v2.x).toBe(27);
      expect(v2.y).toBe(31);
    });
  });

  describe("isEqual", () => {
    it("returns true if 2 vectors are equivalent, false otherwise", () => {
      v = new Vector(26.5, 30.5);
      const v2 = new Vector(26.5, 30.5);
      expect(v.isEqual(v2)).toBe(true);
      v.x = 26.4;
      v.y = 30.4;
      expect(v.isEqual(v2)).toBe(false);
    });
  });
});
