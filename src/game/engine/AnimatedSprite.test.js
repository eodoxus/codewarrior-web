import AnimatedSprite from "./AnimatedSprite";
import Url from "../../lib/Url";
import Size from "./Size";

import plist from "../../../public/animations/hero.json";

let sprite;

describe("AnimatedSprite", () => {
  beforeEach(async () => {
    fetch.mockResponse(JSON.stringify(plist));
    sprite = new AnimatedSprite("hero", new Size(24, 32), 17);
    await sprite.loadAssets();
  });

  afterEach(() => {
    sprite = undefined;
  });

  describe("constructor", () => {
    it("parses animations plist data", () => {
      const animations = sprite.getAnimations();
      sprite.setAnimation(Object.keys(animations)[0]);
      const animation = sprite.getAnimation();
      expect(Object.keys(animations).length).toBeDefined();
      expect(animation.getName()).toBeDefined();
      expect(animation.getFrames()).toBeDefined();
      expect(animation.getFrames().length).toBeDefined();

      const frame = animation.getCurrentFrame();
      const position = frame.getPosition();
      const size = frame.getSize();
      expect(position).toBeDefined();
      expect(position.x).toBeDefined();
      expect(position.y).toBeDefined();
      expect(size.width).toBeDefined();
      expect(size.height).toBeDefined();
    });
  });
});
