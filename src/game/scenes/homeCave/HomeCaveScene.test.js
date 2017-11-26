import HomeCaveScene from "./HomeCaveScene";

jest.mock("../../engine/Graphics");

const mockHero = {
  setMap: jest.fn(),
  setPosition: jest.fn()
};

describe("HomeCaveScene.", () => {
  it("instantiates without crashing", () => {
    const scene = new HomeCaveScene(mockHero);
  });
});
