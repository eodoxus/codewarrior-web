import AnimationCollection from "./AnimationCollection";
import Size from "./Size";
import Sprite from "./Sprite";
import Time from "./Time";
import Vector from "./Vector";

import config from "../entities/hero/config";

let sprite;

beforeEach(() => {
  sprite = new Sprite();
});

afterEach(() => {
  sprite = undefined;
});

describe("Sprite", () => {
  it("doesn't crash when instantiated", () => {
    expect(sprite).toBeDefined();
  });

  it("can update even if not fully initialized", () => {
    sprite.update();
  });

  it("initializes position and size to defaults", () => {
    expect(sprite.position.x).toBeDefined();
    expect(sprite.position.y).toBeDefined();
    expect(sprite.size.width).toBeDefined();
    expect(sprite.size.height).toBeDefined();
    expect(typeof sprite.scale).toBe("number");
  });

  it("initializes position and size to passed in properties", () => {
    sprite = new Sprite(new Vector(1, 2), new Size(3, 4), 5);
    expect(sprite.position.x).toBe(1);
    expect(sprite.position.y).toBe(2);
    expect(sprite.size.width).toBe(3);
    expect(sprite.size.height).toBe(4);
    expect(sprite.scale).toBe(5);
  });

  describe("initFromConfig", () => {
    it("initializes position, velocity and animations properties", () => {
      sprite.initFromConfig(config);
      expect(sprite.acceleration).toBeDefined();
      expect(sprite.animations).toBeDefined();
      expect(sprite.animations.animations).toBeDefined();
      expect(sprite.id).toBe(config.id);
      expect(sprite.velocity).toBeDefined();
      expect(sprite.scale).toBe(config.scale);
      expect(sprite.size.height).toBe(config.height);
      expect(sprite.size.width).toBe(config.width);
    });
  });

  describe("getSize", () => {
    it("returns the size with scale applied", () => {
      sprite.setSize(new Size(2, 4));
      sprite.setScale(2);
      expect(sprite.getSize()).toEqual(new Size(4, 8));
    });
  });

  describe("removeAnimation", () => {
    it("removes an animation by name", () => {
      let collection = new AnimationCollection(config.animations);
      const animationNames = Object.keys(collection.animations);
      const name = animationNames[1];
      sprite.initFromConfig(config);
      expect(sprite.animations.animations[name]).toBeDefined();
      const len = animationNames.length;
      sprite.removeAnimation(name);
      expect(sprite.animations.animations[name]).not.toBeDefined();
      expect(Object.keys(sprite.animations.animations).length).toBe(len - 1);
    });
  });

  describe("update", () => {
    beforeEach(() => {
      sprite.initFromConfig(config);
      sprite.setAnimation(Object.keys(sprite.animations.animations)[0]);
      const animation = sprite.getAnimation();
      animation.reset = jest.fn();
      animation.update = jest.fn();
    });

    it("resets animation when stopped (velocity 0)", () => {
      sprite.velocity = new Vector();
      sprite.update();
      const animation = sprite.getAnimation();
      expect(animation.reset).toHaveBeenCalledTimes(1);
      expect(animation.update).not.toHaveBeenCalled();
    });

    it("updates animation when moving (velocity > 0)", () => {
      sprite.velocity = new Vector(1, 1);
      sprite.update(2);
      const animation = sprite.getAnimation();
      expect(animation.reset).not.toHaveBeenCalled();
      expect(animation.update).toHaveBeenCalledTimes(1);
      expect(animation.update).toHaveBeenCalledWith(2);
    });

    it("updates position when moving (velocity > 0)", () => {
      const dt = 2;
      sprite.position = new Vector(1, 2);
      sprite.velocity = new Vector(1, 1);
      sprite.update(dt);
      expect(sprite.position.x).toBeGreaterThan(1);
      expect(sprite.position.y).toBeGreaterThan(2);
    });
  });
});
