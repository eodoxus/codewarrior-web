import AppModel from "./AppModel";
import DataModel from "./DataModel";

let model;
const data = { slogan: "test" };
const mockResponse = {
  home: "Alpine",
  dogs: { Barkley: "silly", Misha: "sweet" }
};
const RestClient = DataModel.client;
RestClient.get = jest.fn().mockImplementation(() => {
  return Promise.resolve(mockResponse);
});

beforeEach(() => {
  model = new AppModel(data);
});

afterEach(() => {
  model = undefined;
});

describe("constructor", () => {
  it("passes data and its endpoint to super", () => {
    expect(model.slogan).toBe("test");
    expect(model.$url).toBe("/api/site");
  });
});

describe("load", () => {
  it("does a GET request to its url then applies response data to object", () => {
    return model.load().then(() => {
      expect(model.home).toBe("Alpine");
      expect(model.dogs).toEqual({
        Barkley: "silly",
        Misha: "sweet"
      });
    });
  });
});
