import Graphics from "./Graphics";
import Size from "./Size";
import Sprite from "./Sprite";
import Texture from "./Texture";
import TextureCache from "./TextureCache";
import Vector from "./Vector";
import RestClient from "../../lib/RestClient";

import plist from "../../../public/sprites/items.json";

jest.mock("./Graphics");
jest.mock("./TextureCache");

RestClient.prototype.get = () => plist;

const mockBitmap = [
  [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]],
  [[0, 0, 0], [1, 1, 1], [0, 0, 0], [0, 0, 0]],
  [[0, 0, 0], [1, 1, 1], [1, 1, 1], [0, 0, 0]],
  [[0, 0, 0], [1, 1, 1], [1, 1, 1], [1, 1, 1]],
  [[1, 1, 1], [1, 1, 1], [1, 1, 1], [1, 1, 1]],
  [[1, 1, 1], [1, 1, 1], [1, 1, 1], [0, 0, 0]],
  [[0, 0, 0], [1, 1, 1], [1, 1, 1], [0, 0, 0]],
  [[0, 0, 0], [0, 0, 0], [1, 1, 1], [0, 0, 0]]
];
Graphics.getPixel = position => mockBitmap[position.y][position.x];
Graphics.isTransparent = pixel => {
  for (let iDx = 0; iDx < 3; iDx++) {
    if (pixel[iDx] !== 0) {
      return false;
    }
  }
  return true;
};

let sprite;

describe("Sprite", () => {
  beforeEach(() => {
    sprite = new Sprite(new Size(4, 4));
    sprite.setTexture(new Texture("test", new Vector(), new Size(4, 8)));
  });

  describe("Factory", () => {
    it("creates a new empty sprite and sets its properties", () => {
      sprite = Sprite.create({ test: "testProp" });
      expect(sprite.getSize()).toEqual(new Size(100, 100));
      expect(sprite.getProperty("test")).toBe("testProp");
    });
  });

  describe("Getters & Setters", () => {
    describe("getOutline", () => {
      it("returns undefined if outline isn't generated yet", () => {
        expect(sprite.getOutline()).toBeUndefined();
      });
    });

    describe("setSize", () => {
      it("it assigns new size to both sprite and texture", () => {
        const size = new Size(30, 30);
        sprite.setSize(size);
        expect(sprite.getSize()).toBe(size);
        expect(sprite.getTexture().getSize()).toBe(size);
      });
    });
  });

  describe("init", () => {
    it("it caches texture image", async () => {
      await sprite.init();
      expect(TextureCache.fetch).toHaveBeenCalledWith(sprite.getTexture());
    });

    it("it creates new texture from plist data then caches texture when properties are set", async () => {
      sprite.setProperties({
        spriteCollection: "test",
        texture: "bookOfEcmaScript.png",
        width: 4,
        height: 4
      });
      await sprite.init();
      const texture = sprite.getTexture();
      expect(texture.getUrl()).toBe("/sprites/items.png");
      expect(TextureCache.fetch).toHaveBeenCalledWith(texture);
      expect(sprite.getSize()).toEqual(new Size(4, 4));
    });

    it("it uses size from plist data then caches texture when properties are set", async () => {
      sprite.setProperties({
        spriteCollection: "test",
        texture: "bookOfEcmaScript.png"
      });
      await sprite.init();
      const texture = sprite.getTexture();
      expect(texture.getUrl()).toBe("/sprites/items.png");
      expect(TextureCache.fetch).toHaveBeenCalledWith(texture);
      expect(sprite.getSize()).toEqual(new Size(32, 22));
    });
  });

  describe("intersects", () => {
    beforeEach(() => {
      sprite.render(new Vector());
    });

    it("it returns true if a point intersects a non-transparent pixel on the sprite where sprite is positioned on the scene, false otherwise", async () => {
      const point = new Vector(10, 10);
      const spritePosition = new Vector(10, 10);
      expect(sprite.intersects(point, spritePosition)).toBe(false);
      point.x = 11;
      expect(sprite.intersects(point, spritePosition)).toBe(false);
      point.y = 11;
      expect(sprite.intersects(point, spritePosition)).toBe(true);
      point.x = 12;
      point.y = 17;
      expect(sprite.intersects(point, spritePosition)).toBe(true);
    });

    it("it creates new texture from plist data then caches texture when properties are set", async () => {
      sprite.setProperties({
        spriteCollection: "test",
        texture: "bookOfEcmaScript.png",
        width: 4,
        height: 4
      });
      await sprite.init();
      const texture = sprite.getTexture();
      expect(texture.getUrl()).toBe("/sprites/items.png");
      expect(TextureCache.fetch).toHaveBeenCalledWith(texture);
      expect(sprite.getSize()).toEqual(new Size(4, 4));
    });
  });

  describe("render", () => {
    it("generates outline object", () => {
      sprite.render(new Vector());
      const outline = sprite.getOutline();
      expect(outline.rows.length).toBe(8);
      expect(outline.min).toBe(0);
      expect(outline.max).toBe(3);
      expect(outline.rows[0]).toBeUndefined();
      expect(outline.rows[1]).toEqual({ start: 1, end: 1 });
      expect(outline.rows[2]).toEqual({ start: 1, end: 2 });
      expect(outline.rows[3]).toEqual({ start: 1, end: 3 });
      expect(outline.rows[4]).toEqual({ start: 0, end: 3 });
      expect(outline.rows[5]).toEqual({ start: 0, end: 2 });
      expect(outline.rows[6]).toEqual({ start: 1, end: 2 });
      expect(outline.rows[7]).toEqual({ start: 2, end: 2 });
    });

    it("draws texture to generate outline, then again to draw sprite on initial render", () => {
      const position = new Vector();
      Graphics.drawTexture.mockReset();
      sprite.render(position);
      expect(Graphics.drawTexture).toHaveBeenCalledTimes(2);
      Graphics.drawTexture.mockReset();
      sprite.render(position);
      expect(Graphics.drawTexture).toHaveBeenCalledTimes(1);
      const texture = sprite.getTexture();
      expect(Graphics.drawTexture).toHaveBeenCalledWith(
        texture.getImage(),
        texture.getSize(),
        texture.getPosition(),
        position,
        1.0
      );
    });

    it("draws semi-transparent rect and solid point over sprite when in debug", () => {
      Graphics.debug = true;
      const position = new Vector();
      sprite.render(position);
      const texture = sprite.getTexture();
      expect(Graphics.drawTexture).toHaveBeenCalledWith(
        texture.getImage(),
        texture.getSize(),
        texture.getPosition(),
        position,
        0.5
      );
      expect(Graphics.drawRect).toHaveBeenCalledTimes(1);
      expect(Graphics.drawPoint).toHaveBeenCalledTimes(1);
    });
  });
});
