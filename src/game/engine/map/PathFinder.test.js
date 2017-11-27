import PathFinder from "./PathFinder";
import TiledMap from "./TiledMap";
import Vector from "../Vector";

import tmxConfig from "./__mocks__/map.json";
import Tile from "./Tile";
import Size from "../Size";

let map;
beforeEach(() => {
  fetch.mockResponse(JSON.stringify(tmxConfig));
  map = new TiledMap("test");
  map.loadAssets();
});
afterEach(() => {
  map = undefined;
});

describe("PathFinder", () => {
  describe("constructor", () => {
    it("should init map and path", () => {
      let pathFinder = new PathFinder();
      expect(pathFinder.map).not.toBeDefined();
      expect(pathFinder.path.length).toBe(0);

      pathFinder = new PathFinder(map);
      expect(pathFinder.map).toBeDefined();
    });
  });

  it("should find a path from start tile to end tile", () => {
    const pathFinder = new PathFinder(map);
    const start = new Vector(40, 64);
    const end = new Vector(160, 136);
    const expectedNumSteps = 24;
    pathFinder.findPath(start, end);
    expect(pathFinder.getPath().length).toBe(expectedNumSteps);
    for (let iDx = 0; iDx < expectedNumSteps; iDx++) {
      const step = pathFinder.getNextStep();
      expect(step).toBeDefined();
    }
  });
});
