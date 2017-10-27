import Sprite from "./Sprite";

describe("Sprite", () => {
  it("doesn't crash when instantiated", () => {
    const sprite = new Sprite();
    expect(sprite).toBeDefined();
  });
});
