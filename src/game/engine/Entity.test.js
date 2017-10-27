import Entity from "./Entity";

describe("Entity", () => {
  it("doesn't crash when instantiated", () => {
    const entity = new Entity();
    expect(entity).toBeDefined();
  });
});
