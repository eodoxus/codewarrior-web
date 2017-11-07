import AnimationCollection from "./AnimationCollection";

import config from "../entities/hero/config";

let collection;

describe("AnimationCollection", () => {
  beforeEach(() => {
    collection = new AnimationCollection(config.animations);
  });

  afterEach(() => {
    collection = undefined;
  });

  describe("constructor", () => {
    it("parses animations plist data", () => {
      const animationNames = Object.keys(collection.animations);
      const animation = collection.animations[animationNames[0]];
      const frame = animation.frames[0];
      expect(Object.keys(collection.animations).length).toBeDefined();
      expect(animation.name).toBeDefined();
      expect(animation.url).toBeDefined();
      expect(animation.width).toBeDefined();
      expect(animation.height).toBeDefined();
      expect(animation.speed).toBeDefined();
      expect(animation.frames).toBeDefined();
      expect(animation.frames.length).toBeDefined();
      expect(frame.name).toBeDefined();
      expect(frame.x).toBeDefined();
      expect(frame.y).toBeDefined();
      expect(frame.width).toBeDefined();
      expect(frame.height).toBeDefined();
    });
  });

  describe("get", () => {
    it("retrieves an animation by name", () => {
      const animationName = "walking_up";
      const animation = collection.get(animationName);
      expect(animation.name).toBe(animationName);
    });

    it("throws exception if frame doesn't exist", () => {
      try {
        const animation = collection.get("test");
      } catch (e) {
        expect(e.message).toContain("doesn't exist");
      }
    });
  });

  describe("remove", () => {
    it("removes an animation by name", () => {
      const animationName = "walking_up";
      expect(collection.animations[animationName]).toBeDefined();
      collection.remove(animationName);
      expect(collection.animations[animationName]).toBeUndefined();
    });
  });
});
