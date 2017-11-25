import Scene from "./Scene";

const mockHero = {
  setMap: jest.fn(),
  setPosition: jest.fn()
};

describe("Scene", () => {
  it("instantiates without crashing", () => {
    const scene = new Scene(mockHero);
  });
});
