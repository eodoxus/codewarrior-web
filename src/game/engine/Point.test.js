import Point from "./Point";

describe("Point", () => {
  it("doesn't crash when instantiated", () => {
    const point = new Point();
    expect(point).toBeDefined();
  });
});
