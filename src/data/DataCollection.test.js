import DataCollection from "./DataCollection";
import DataModel from "./DataModel";
import GameSaveModel from "./GameSaveModel";
import RestClient from "../lib/RestClient";

const mockList = [{ id: 1 }, { id: 2 }];
RestClient.prototype.get = jest.fn().mockImplementation(() => {
  return Promise.resolve(mockList);
});

describe("constructor", () => {
  it("sets $url and $classname", () => {
    const model = new DataCollection(GameSaveModel);
    expect(model.$className).toBe(GameSaveModel);
    expect(model.$url).toBe("/api/game_saves");
  });

  describe("create and list", () => {
    let model;
    beforeEach(() => {
      model = DataCollection.create(GameSaveModel);
    });

    it("returns a list of instances of passed in class type", async () => {
      const list = await model.list({ param1: "test" });
      expect(list).toEqual([
        new GameSaveModel({ id: 1 }),
        new GameSaveModel({ id: 2 })
      ]);
      expect(RestClient.prototype.get).toHaveBeenCalledWith(
        "/api/game_saves?param1=test"
      );
    });

    it("returns an empty array if RestClient get response is not an array", async () => {
      RestClient.prototype.get.mockReturnValue({});
      const list = await model.list({ param1: "test" });
      expect(list).toEqual([]);
    });
  });
});
