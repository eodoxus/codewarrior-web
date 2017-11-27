import Hero from "./Hero";
import Size from "../../engine/Size";
import Vector from "../../engine/Vector";

import plist from "../../../../public/animations/hero.json";

let hero;
let Entity = Hero.__proto__.prototype;

beforeEach(async () => {
  fetch.mockResponse(JSON.stringify(plist));
  hero = new Hero();
  await hero.loadAssets();
});

describe("Hero", () => {
  describe("construction", () => {
    it("should initialize sprite, state, velocity and animation", () => {
      expect(hero.getState()).toBe(0);
      expect(hero.getVelocity()).toEqual(new Vector());
    });
  });

  describe("loadAssets", () => {
    it("should initialize new HeroSprite and initial animation", () => {
      expect(hero.getSprite().getSize()).toEqual(new Size(24, 32));
      const animation = hero.getSprite().getAnimation();
      expect(animation.name).toBe("walking_down");
    });
  });

  describe("setPosition", () => {
    it("should set hero's position to incoming point translated to hero origin", () => {
      hero.setPosition(new Vector(20, 20));
      expect(hero.getPosition()).toEqual(new Vector(8, 4));
    });
  });

  describe("update", () => {
    it("calls parent class update.", () => {
      Entity.update = jest.fn();
      hero.update();
      expect(Entity.update).toHaveBeenCalled();
    });

    it("should update animation if velocity is > 0", () => {
      hero.setVelocity(new Vector(1, 1));
      const sprite = hero.getSprite();
      sprite.updateCurrentAnimation = jest.fn();
      const animation = sprite.getAnimation();
      animation.update = jest.fn();
      hero.update();
      expect(sprite.updateCurrentAnimation).toHaveBeenCalled();
      expect(animation.update).toHaveBeenCalled();
    });
  });

  describe("walkTo", () => {
    it("set state to walking and call parent walkTo", () => {
      Entity.walkTo = jest.fn();
      hero.walkTo();
      expect(hero.getState()).toBe(Hero.STATES.WALKING);
      expect(Entity.walkTo).toHaveBeenCalled();
    });
  });
});
