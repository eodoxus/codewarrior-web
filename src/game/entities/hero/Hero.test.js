import Hero from "./Hero";
import Entity from "../../engine/Entity";
import Size from "../../engine/Size";
import Vector from "../../engine/Vector";

describe("Hero", () => {
  describe("construction", () => {
    it("should not crash when instantiated", () => {
      const hero = new Hero();
    });

    it("should initialize sprite, state, velocity and animation", () => {
      const hero = new Hero();
      expect(hero.getSprite().getSize()).toEqual(new Size(24, 32));
      expect(hero.getState()).toBe(0);
      expect(hero.getVelocity()).toEqual(new Vector());
      const animation = hero.getSprite().getAnimation();
      expect(animation.name).toBe("walking_down");
    });
  });

  describe("setPosition", () => {
    it("should set hero's position to incoming point translated to hero origin", () => {
      const hero = new Hero();
      hero.setPosition(new Vector(20, 20));
      expect(hero.getPosition()).toEqual(new Vector(8, 4));
    });
  });

  describe("update", () => {
    let hero;
    let parent = Hero.__proto__.prototype;
    beforeEach(() => {
      parent.update = jest.fn();
      hero = new Hero();
    });

    it("calls parent class update.", () => {
      hero.update();
      expect(parent.update).toHaveBeenCalled();
    });

    it("should reset animation if velocity is 0", () => {
      const animation = hero.getSprite().getAnimation();
      animation.reset = jest.fn();
      hero.update();
      expect(animation.reset).toHaveBeenCalled();
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
    let parent = Hero.__proto__.prototype;

    it("set state to walking and call parent walkTo", () => {
      const hero = new Hero();
      parent.walkTo = jest.fn();
      hero.walkTo();
      expect(hero.getState()).toBe(Hero.STATES.WALKING);
      expect(parent.walkTo).toHaveBeenCalled();
    });
  });
});
