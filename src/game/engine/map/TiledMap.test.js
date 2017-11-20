import Graphics from "../../engine/Graphics";
import Size from "../Size";
import TiledMap from "./TiledMap";
import Vector from "../Vector";
import TextureCache from "../../engine/TextureCache";

jest.mock("../Graphics");

import tmxConfig from "./__mocks__/map.json";
let map;
beforeEach(() => {
  map = new TiledMap("test", tmxConfig);
});
afterEach(() => {
  map = undefined;
});

describe("TiledMap", () => {
  it("parses tileset and layer info from TMX config file", () => {
    const tex = map.getTilesetTexture();
    const tileSize = map.getTileSize();
    const spawnPoint = map.getHeroSpawnPoint();
    const layers = map.getLayers();

    expect(tex).toBe("/maps/overworld.png");
    expect(tileSize).toEqual(new Size(8, 8));
    expect(spawnPoint).toEqual(new Vector(113, 143.5));
    expect(layers.length).toBe(4);
    expect(map.getName()).toBe("test");
  });

  describe("render", () => {
    it("renders all layers", () => {
      map.renderLayer = jest.fn();
      map.render();
      expect(map.renderLayer).toHaveBeenCalledTimes(4);
    });
  });

  describe("renderLayer", () => {
    let layers;
    beforeEach(() => {
      map.renderTile = jest.fn();
      layers = map.getLayers();
    });

    it("renders all tiles in layer", () => {
      map.renderLayer(layers[0]);
      expect(map.renderTile).toHaveBeenCalledTimes(768);
    });

    it("caches rendered layer in texture cache", () => {
      TextureCache.purge();
      const textureName = "layer-test-background";
      expect(TextureCache.get(textureName)).not.toBeDefined();
      map.renderLayer(layers[0]);
      expect(TextureCache.get(textureName)).toBeDefined();
      map.renderTile.mockClear();
      map.renderLayer(layers[0]);
      expect(map.renderTile).not.toHaveBeenCalled();
    });
  });

  describe("renderTile", () => {
    it("uses Graphics engine to draw tile texture on screen", () => {
      Graphics.drawTexture = jest.fn();
      const textureName = map.getTilesetTexture();
      TextureCache.put(textureName);
      const tex = TextureCache.get(map.getTilesetTexture());

      const tile = map.getLayers()[0].tiles[255];
      map.renderTile(tile);
      expect(Graphics.drawTexture).toHaveBeenCalledTimes(1);
      expect(Graphics.drawTexture).toHaveBeenCalledWith(
        tex,
        new Size(8, 8),
        new Vector(0, 0),
        new Vector(248, 56)
      );
    });
  });
});
