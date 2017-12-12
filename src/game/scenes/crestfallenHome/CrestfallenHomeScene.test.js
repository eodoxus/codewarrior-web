import CrestfallenHomeScene from "./CrestfallenHomeScene";

jest.mock("../../engine/Graphics");

const mockHero = {
  setMap: jest.fn(),
  setPosition: jest.fn()
};

describe("CrestfallenHomeScene", () => {
  it("instantiates without crashing", () => {
    const scene = new CrestfallenHomeScene(mockHero);
  });
});
