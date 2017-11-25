import HomeScene from "./HomeScene";

jest.mock("../../engine/Graphics");

const mockHero = {
  setMap: jest.fn(),
  setPosition: jest.fn()
};

describe("HomeScene", () => {
  it("instantiates without crashing", () => {
    const scene = new HomeScene(mockHero);
  });
});
