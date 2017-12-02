import CrestfallenMage from "../npcs/crestfallenMage/CrestfallenMage";
import Hero from "./Hero";
import Size from "../../engine/Size";
import Scene from "../../engine/Scene";
import Sprite from "../../engine/Sprite";
import Tile from "../../engine/map/Tile";
import TiledMap from "../../engine/map/TiledMap";
import Vector from "../../engine/Vector";

import plist from "../../../../public/animations/hero.json";
import npcPlist from "../../../../public/animations/npcs.json";
import tmxConfig from "../../engine/map/__mocks__/map.json";
import outline from "../../engine/__mocks__/SpriteOutline.json";
Sprite.prototype.getOutline = jest.fn();
Sprite.prototype.getOutline.mockReturnValue(outline);

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
      jest.spyOn(Entity, "update");
      hero.update();
      expect(Entity.update).toHaveBeenCalled();
      Entity.update.mockRestore();
    });

    it("should update animation if velocity is > 0 and hero is moving", () => {
      hero.setVelocity(new Vector(1, 1));
      hero.setState(Hero.STATES.WALKING);
      const sprite = hero.getSprite();
      sprite.pickAnimation = jest.fn();
      const animation = sprite.getAnimation();
      animation.update = jest.fn();
      hero.update();
      expect(sprite.pickAnimation).toHaveBeenCalled();
      expect(animation.update).toHaveBeenCalled();
    });
  });

  describe("walkTo", () => {
    it("set state to walking and call parent walkTo", () => {
      jest.spyOn(Entity, "walkTo").mockImplementation(() => true);
      hero.walkTo();
      expect(hero.getState()).toBe(Hero.STATES.WALKING);
      expect(Entity.walkTo).toHaveBeenCalled();
      Entity.walkTo.mockRestore();
    });
  });

  describe("Collisions", () => {
    it("should route around NPCs", async () => {
      const map = new TiledMap();
      map.loadTMXConfig(tmxConfig);
      const npc = new CrestfallenMage(null, new Vector(80, 66));
      npc.getSprite().loadAnimations(npcPlist);
      npc.setProperties({ npc: true });

      const heroCollisionSpy = jest.spyOn(hero, "handleCollision");
      const heroRerouteSpy = jest.spyOn(hero, "reroute");
      const npcCollisionSpy = jest.spyOn(npc, "handleCollision");

      const scene = new Scene(hero);
      scene.addEntity(npc);
      scene.setMap(map);
      hero.setPosition(new Vector(50, 66));
      hero.walkTo(Tile.point(new Vector(112, 72)));
      while (hero.state === Hero.STATES.WALKING) {
        scene.update(20);
        npc.stop();
      }
      expect(heroCollisionSpy).toHaveBeenCalled();
      expect(npcCollisionSpy).toHaveBeenCalled();
      expect(heroRerouteSpy).toHaveBeenCalled();
    });
  });
});
