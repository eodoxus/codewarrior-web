import Scene from "./Scene";

const mockHero = {
  setPosition: jest.fn()
};

describe("Scene", () => {
  it("instantiates without crashing", () => {
    const scene = new Scene(mockHero);
  });
});
