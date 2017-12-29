import CrestfallenMage from "../npcs/crestfallenMage/CrestfallenMage";
import GameEvent from "../../engine/GameEvent";
import Hero from "./Hero";
import PacingMovement from "../components/movements/PacingMovement";
import Rect from "../../engine/Rect";
import Size from "../../engine/Size";
import Scene from "../../engine/Scene";
import Sprite from "../../engine/Sprite";
import StoppedState from "./states/StoppedState";
import Tile from "../../engine/map/Tile";
import TiledMap from "../../engine/map/TiledMap";
import Vector from "../../engine/Vector";
import WalkingState from "./states/WalkingState";

import plist from "../../../../public/animations/hero.json";
import npcPlist from "../../../../public/animations/npcs.json";
import tmxConfig from "../../engine/map/__mocks__/map.json";
import outline from "../../engine/__mocks__/SpriteOutline.json";

jest.useFakeTimers();

Sprite.prototype.getOutline = jest.fn();
Sprite.prototype.getOutline.mockReturnValue(outline);

let hero;
let Entity = Hero.__proto__.prototype;

beforeEach(async () => {
  fetch.mockResponse(JSON.stringify(plist));
  hero = new Hero();
  await hero.init();
  hero.update(0);
});

describe("Hero", () => {
  describe("construction", () => {
    it("should initialize sprite, state, velocity and animation", () => {
      expect(hero.getState()).toEqual(new StoppedState(hero));
      expect(hero.getVelocity()).toEqual(new Vector());
    });
  });

  describe("init", () => {
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
      hero.setState(new WalkingState(hero));
      const sprite = hero.getSprite();
      const animation = sprite.getAnimation();
      animation.update = jest.fn();
      hero.update();
      expect(animation.update).toHaveBeenCalled();
    });
  });

  describe("Behavior", () => {
    let npc;
    let map;
    let scene;

    beforeEach(() => {
      npc = new CrestfallenMage(null);
      npc.getSprite().loadAnimations(npcPlist);
      npc.setProperties({ npc: true });

      scene = new Scene(hero);
      npc.setMovement(PacingMovement.create(npc, new Vector(80, 66)));
      scene.addEntity(npc);

      map = new TiledMap();
      map.loadTMXConfig(tmxConfig);
      scene.setMap(map);
    });

    it("should route around NPCs", () => {
      hero.setPosition(new Vector(50, 66));
      const state = new WalkingState(hero);
      hero.setState(state);
      const destination = hero.translateToOrigin(new Vector(112, 72));
      hero.getMovement().walkTo(Rect.point(destination));
      npc.getBehavior().start();

      const heroRerouteSpy = jest.spyOn(hero.getMovement(), "reroute");
      while (hero.getState() === state) {
        scene.update();
      }
      expect(heroRerouteSpy).toHaveBeenCalled();
    });

    it("should talk to NPCs when NPC is clicked, then collided with", () => {
      // Simulate npc click
      function simulateNpcClick() {
        const tile = map.getTileAt(new Vector());
        tile.setEntity(npc);
        hero.handleEvent(GameEvent.click(tile));
      }

      function simulateNpcCollision() {
        hero.handleEvent(GameEvent.collision(npc));
        jest.runAllTimers();
      }

      // Hero intent should be "talk" when NPC is clicked
      hero.setPosition(new Vector(50, 50));
      npc.setPosition(new Vector(100, 100));
      simulateNpcClick();
      expect(hero.getBehavior().isIntent("talk")).toBe(true);

      // Hero should face and talk to entity when they collide and hero's intent is "talk"
      simulateNpcCollision();
      expect(hero.getBehavior().getState() instanceof StoppedState).toBe(true);
      // Check hero is facing entitie's direction
      expect(hero.getMovement().getOrientation()).toEqual(new Vector(1, 1));
      expect(hero.getBehavior().hasIntent()).toBe(false);

      npc.setPosition(new Vector(0, 100));
      simulateNpcClick();
      simulateNpcCollision();
      expect(hero.getMovement().getOrientation()).toEqual(new Vector(-1, 1));

      npc.setPosition(new Vector(100, 0));
      simulateNpcClick();
      simulateNpcCollision();
      expect(hero.getMovement().getOrientation()).toEqual(new Vector(1, -1));

      npc.setPosition(new Vector(0, 0));
      simulateNpcClick();
      simulateNpcCollision();
      expect(hero.getMovement().getOrientation()).toEqual(new Vector(-1, -1));
    });
  });

  describe("Api", () => {
    let api;
    beforeEach(() => {
      api = hero.getApi();
      const scene = document.createElement("div");
      scene.id = "scene";
      document.body.appendChild(scene);
    });

    describe("jump", () => {
      function jumpFailExpectation(position, msg) {
        try {
          api.jump(position);
          fail("Expected jump to fail");
        } catch (e) {
          expect(e.message).toBe(msg);
        }
      }

      it("should fail if no tile is passed", () => {
        const msg = "You must pass a position (x, y) to my jump command";
        jumpFailExpectation(null, msg);
      });

      it("should fail if tile doesn't have x-coord", () => {
        const msg =
          "The position passed to my jump command requires an x coordinate";
        jumpFailExpectation({}, msg);
      });

      it("should fail if tile doesn't have y-coord", () => {
        const msg =
          "The position passed to my jump command requires a y coordinate";
        jumpFailExpectation({ x: 1 }, msg);
      });

      it("should fail if tile is too far", () => {
        const msg = "That's too far";
        jumpFailExpectation({ x: 29, y: 0 }, msg);
        jumpFailExpectation({ x: -37, y: 0 }, msg);
        jumpFailExpectation({ x: 0, y: 27 }, msg);
        jumpFailExpectation({ x: 0, y: -39 }, msg);
      });

      it("should move hero to tile", () => {});
    });

    describe("pickTarget", () => {
      it("should bring up target cursor and wait for tile to be clicked", async () => {
        return new Promise(resolve => {
          api.pickTarget(target => {
            expect(target.x).toBe(10);
            expect(target.y).toBe(20);
            resolve();
          });
          const scene = document.getElementById("scene");
          expect(scene.style.cursor).toBe("crosshair");
          hero.handleEvent(
            GameEvent.click(new Tile(new Vector(10, 20), new Size(8, 8)))
          );
          jest.runAllTimers();
          expect(scene.style.cursor).toBe("pointer");
        });
      });
    });
  });
});
