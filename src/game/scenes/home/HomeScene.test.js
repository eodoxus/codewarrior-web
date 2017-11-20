import HomeScene from "./HomeScene";

jest.mock("../../engine/Graphics");

const mockHero = {
  setPosition: jest.fn()
};

describe("HomeScene", () => {
  it("instantiates without crashing", () => {
    const sprites = [mockHero];
    const scene = new HomeScene(sprites);
  });
});
