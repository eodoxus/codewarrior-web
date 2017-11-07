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
  });

  describe("magnitude", () => {
    it("calculates the length of the vector", () => {
      v = new Vector(2, 3).normalize();
      expect(v.magnitude()).toBe(1);
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
  });
});
