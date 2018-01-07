import Graphics from "../../engine/Graphics";
import Size from "../Size";
import TiledMap from "./TiledMap";
import Vector from "../Vector";
import TextureCache from "../../engine/TextureCache";

import tmxConfig from "./__mocks__/map.json";

jest.mock("../Graphics");

let map;
beforeEach(async () => {
  Graphics.debug = false;
  fetch.mockResponse(JSON.stringify(tmxConfig));
  map = new TiledMap("test");
  await map.init();
});
afterEach(() => {
  map = undefined;
});

describe("TiledMap", () => {
  describe("Getters & Setters", () => {
    it("allows user to get all properties or individual properties of map", () => {
      const properties = { test: "test" };
      map.setProperties(properties);
      expect(map.getProperty("test")).toBe("test");
      expect(map.getProperties()).toEqual(properties);
    });
  });

  describe("getTileAt", () => {
    it("gets the tile at position", () => {
      const tile = map.getTileAt(new Vector());
      expect(tile).toBeDefined();
    });

    it("returns undefined if there is not a tile at position", () => {
      const tile = map.getTileAt(new Vector(600, 0));
      expect(tile).toBeUndefined();
    });
  });

  describe("getClosestWalkableTile", () => {
    it("gets the tile closest to position", () => {
      const tile = map.getClosestWalkableTile(new Vector());
      expect(tile).toBeDefined();
      expect(tile.getPosition()).toEqual(new Vector(24, 16));
    });

    it("returns undefined if there is not a tile at position", () => {
      const tile = map.getClosestWalkableTile(new Vector(600, 0));
      expect(tile).toBeDefined();
      expect(tile.getPosition()).toEqual(new Vector(240, 32));
    });
  });

  describe("loadTMXConfig", () => {
    it("parses tileset and layer info from TMX config file", () => {
      expect(map.getTexture()).toBe("/maps/overworld.png");
      expect(map.getTileSize()).toEqual(new Size(8, 8));
      expect(map.getHeroSpawnPoint()).toEqual(new Vector(98, 102));
      expect(map.getName()).toBe("test");
      const layers = map.getLayers();
      expect(layers.length).toBe(3);
      expect(layers[0].getId()).toBe("test-background");
      expect(layers[0].getName()).toBe("background");
      expect(layers[0].getSize()).toEqual(new Size(32, 24));
    });

    it("does nothing if there are no tilesets in tmx config", () => {
      map = new TiledMap("test");
      map.loadTMXConfig({});
      expect(map.getProperties()).toEqual({});
      expect(map.getLayers().length).toEqual(0);
    });
  });

  describe("render", () => {
    it("renders all layers", () => {
      map.renderLayer = jest.fn();
      map.render();
      expect(map.renderLayer).toHaveBeenCalledTimes(3);
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
    beforeEach(() => {
      Graphics.drawTexture.mockReset();
    });

    it("uses Graphics engine to draw tile texture on screen", () => {
      const tex = TextureCache.get(map.getTexture());
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

    it("draws debug overlays on tile when in debug mode", () => {
      Graphics.debug = true;
      const tex = TextureCache.get(map.getTexture());
      const tile = map.getLayers()[0].tiles[255];
      map.renderTile(tile);
      expect(Graphics.drawPoint).toHaveBeenCalledTimes(1);
      expect(Graphics.colorize).toHaveBeenCalledTimes(1);

      tile.isWalkable = jest.fn().mockReturnValue(true);
      tile.isDoorway = jest.fn().mockReturnValue(true);
      Graphics.colorize.mockReset();
      map.renderTile(tile);
      expect(Graphics.colorize).toHaveBeenCalledTimes(1);

      tile.isWalkable = jest.fn().mockReturnValue(true);
      tile.isDoorway = jest.fn().mockReturnValue(false);
      tile.isTransition = jest.fn().mockReturnValue(true);
      Graphics.colorize.mockReset();
      map.renderTile(tile);
      expect(Graphics.colorize).toHaveBeenCalledTimes(1);
    });
  });
});
