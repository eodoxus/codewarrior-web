import WoodCuttersHouseScene from "./WoodCuttersHouseScene";

jest.mock("../../engine/Graphics");

const mockHero = {
  setMap: jest.fn(),
  setPosition: jest.fn()
};

describe("WoodCuttersHouseScene", () => {
  it("instantiates without crashing", () => {
    const scene = new WoodCuttersHouseScene(mockHero);
  });
});
