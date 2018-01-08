import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import { setTimeout, setInterval } from "timers";
import Camera from "../Camera";
import GameEvent from "./GameEvent";
import GameState from "../GameState";
import Graphics from "./Graphics";
import Hero from "../entities/hero/Hero";
import Time from "./Time";
import Scene from "./Scene";
import SceneDirector from "./SceneDirector";
import SceneTransitioner from "./SceneTransitioner";
import Size from "./Size";
import Spell from "../entities/items/Spell";
import TatteredPage from "../entities/items/TatteredPage";
import TextureCache from "./TextureCache";
import Tile from "./map/Tile";
import Vector from "./Vector";

import dialog from "../../../public/dialog.json";

jest.mock("./Audio");
jest.mock("./Graphics");
jest.mock("./Scene");
jest.mock("./SceneLoader");
jest.mock("../GameState");
jest.useFakeTimers();
fetch.mockResponse("{}");

Hero.prototype.init = jest.fn();

let div;
let ctrl;

function waitForSceneLoad() {
  return new Promise(resolve => {
    (function wait() {
      jest.runTimersToTime(100);
      ctrl.state.isLoading || !ctrl.scene ? setTimeout(wait) : resolve();
    })();
  });
}

beforeEach(async () => {
  div = document.createElement("div");
  ctrl = ReactDOM.render(<SceneDirector />, div);
  return waitForSceneLoad();
});

afterEach(() => {
  div.remove();
});

describe("<SceneDirector />", () => {
  it("sets default props", () => {
    expect(ctrl.props).toEqual({
      width: 0,
      height: 0,
      scale: 1
    });
  });

  it("initializes hero", () => {
    const hero = ctrl.scene.getEntities()[0];
    expect(hero.getPosition()).toBeDefined();
  });

  it("removes event listeners on component unmount", () => {
    window.removeEventListener = jest.fn();
    document.removeEventListener = jest.fn();
    jest.spyOn(GameEvent, "removeAllListeners");
    ctrl.componentWillUnmount();
    expect(window.removeEventListener).toHaveBeenCalledTimes(1);
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "resize",
      ctrl.initCamera
    );
    expect(document.removeEventListener).toHaveBeenCalledTimes(1);
    expect(document.removeEventListener).toHaveBeenCalledWith(
      "keyup",
      ctrl.onKeyUp
    );
    expect(GameEvent.removeAllListeners).toHaveBeenCalledTimes(1);
    GameEvent.removeAllListeners.mockRestore();
  });

  describe("onClick", () => {
    let mockEvent = {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
      clientX: 120,
      clientY: 240,
      currentTarget: {
        getBoundingClientRect: () => {
          return {
            x: 100,
            y: 200
          };
        }
      }
    };

    it("converts click position to scene vector space", () => {
      ctrl.hero.intersects = jest.fn();
      ctrl.scene.onClick = jest.fn();
      ctrl.onClick(mockEvent);
      ctrl.state.isLoading = false;
      ctrl.gameLoop();
      expect(ctrl.scene.onClick).toHaveBeenCalledWith(new Vector(20, 40));
    });

    it("doesn't send click to scene if hero was clicked", () => {
      ctrl.hero.intersects = jest.fn();
      ctrl.hero.intersects.mockReturnValue(true);
      ctrl.scene.onClick = jest.fn();
      ctrl.onClick(mockEvent);
      expect(ctrl.scene.onClick).not.toHaveBeenCalled();
    });
  });

  describe("onDoorwayTransition", () => {
    let isCurtainOpen;
    let isHeroMenuOpen;
    let isDialogOpen;

    beforeEach(async () => {
      isCurtainOpen = true;
      isHeroMenuOpen = true;
      isDialogOpen = true;
      GameEvent.on(GameEvent.CLOSE_CURTAIN, () => (isCurtainOpen = false));
      GameEvent.on(GameEvent.OPEN_CURTAIN, () => (isCurtainOpen = true));
      GameEvent.on(GameEvent.CLOSE_HERO_MENU, () => (isHeroMenuOpen = false));
      GameEvent.on(GameEvent.CLOSE_DIALOG, () => (isDialogOpen = false));
      const doorway = new Tile(new Vector(), new Size());
      doorway.setProperties({
        orientationY: "1",
        orientationx: "0",
        spawnHeroX: "40",
        spawnHeroY: "40",
        to: "Home"
      });
      ctrl.onDoorwayTransition(doorway);
    });

    it("closes curtain", () => {
      expect(isCurtainOpen).toBe(false);
    });

    it("reopens curtain after scene loads and curtain animation completes", async () => {
      expect(isCurtainOpen).toBe(false);
      await waitForSceneLoad();
      expect(isCurtainOpen).toBe(true);
    });

    it("spawns hero at spawn point specified by map", async () => {
      expect(ctrl.hero.getPosition()).toEqual(new Vector(-12, -16));
      await waitForSceneLoad();
      expect(ctrl.hero.getPosition()).toEqual(new Vector(28, 24));
    });

    it("loads new scene", async () => {
      const scene = ctrl.scene;
      await waitForSceneLoad();
      expect(scene).not.toEqual(ctrl.scene);
    });

    it("starts game loop", async () => {
      Graphics.clear.mockReset();
      ctrl.lastTime = 0;
      ctrl.dt = 1;
      await waitForSceneLoad();
      expect(ctrl.dt).toBe(0);
      expect(ctrl.lastTime).not.toBe(0);
      expect(Graphics.clear).toHaveBeenCalled();
      expect(ctrl.scene.render).toHaveBeenCalled();
    });
  });

  describe("onKeyUp", () => {
    it("adds hero click to GameEvent input queue on space key press", async () => {
      ctrl.onKeyUp({ key: " " });
      expect(GameEvent.inputQueue().getNext()).toEqual(
        GameEvent.heroClick(ctrl.hero)
      );
    });

    it("closes menu compontents on escape key press", async () => {
      let isDialogOpen = true;
      let isHeroMenuOpen = true;
      let isEditorOpen = true;
      GameEvent.on(GameEvent.CLOSE_HERO_MENU, () => (isHeroMenuOpen = false));
      GameEvent.on(GameEvent.CLOSE_DIALOG, () => (isDialogOpen = false));
      GameEvent.on(GameEvent.CLOSE_TATTERED_PAGE, () => (isEditorOpen = false));
      ctrl.onKeyUp({ key: "Escape" });
      expect(isDialogOpen).toBe(false);
      expect(isHeroMenuOpen).toBe(false);
      expect(isEditorOpen).toBe(false);
    });

    describe("Spell Casting", () => {
      let tatteredPage;
      beforeEach(() => {
        tatteredPage = new TatteredPage();
        for (let iDx = 0; iDx < 2; iDx++) {
          const spell = new Spell();
          spell.cast = jest.fn();
          tatteredPage.addSpell(spell);
        }
      });

      it("casts spell assigned to key on number key press", async () => {
        ctrl.hero.getInventory().add(TatteredPage.NAME, tatteredPage);
        ctrl.onKeyUp({ key: "1" });
        expect(tatteredPage.getSpell(0).cast).toHaveBeenCalledTimes(1);
        ctrl.onKeyUp({ key: "2" });
        expect(tatteredPage.getSpell(1).cast).toHaveBeenCalledTimes(1);
      });

      it("does nothing on spell key press if there isn't a spell assigned", async () => {
        ctrl.hero.getInventory().add(TatteredPage.NAME, tatteredPage);
        ctrl.onKeyUp({ key: "3" });
        expect(tatteredPage.getSpell(0).cast).not.toHaveBeenCalled();
        expect(tatteredPage.getSpell(1).cast).not.toHaveBeenCalled();
      });

      it("does nothing if hero doesn't have spell container", async () => {
        tatteredPage.getSpell = jest.fn();
        ctrl.onKeyUp({ key: "1" });
        expect(tatteredPage.getSpell).not.toHaveBeenCalled();
      });
    });
  });

  describe("onSceneTransition", () => {
    let isCurtainOpen;
    let isHeroMenuOpen;
    let isDialogOpen;
    let isBorderVisible;

    beforeEach(async () => {
      isCurtainOpen = true;
      isHeroMenuOpen = true;
      isDialogOpen = true;
      GameEvent.on(GameEvent.CLOSE_CURTAIN, () => (isCurtainOpen = false));
      GameEvent.on(GameEvent.CLOSE_HERO_MENU, () => (isHeroMenuOpen = false));
      GameEvent.on(GameEvent.CLOSE_DIALOG, () => (isDialogOpen = false));
      const transition = new Tile(new Vector(), new Size());
      transition.setProperties({
        orientationY: "1",
        orientationx: "0",
        spawnHeroX: "40",
        spawnHeroY: "40",
        to: "Home"
      });
      ctrl = await ReactDOM.render(<SceneDirector canShowBorder={true} />, div);
      SceneTransitioner.prototype.animate = jest
        .fn()
        .mockImplementation(() => (ctrl.state.isLoading = false));
      ctrl.onSceneTransition(transition);
    });

    it("doesn't close curtain", () => {
      expect(isCurtainOpen).toBe(true);
    });

    it("proxies scene loading to SceneTransitioner", async () => {
      await waitForSceneLoad();
      expect(SceneTransitioner.prototype.animate).toHaveBeenCalledTimes(1);
    });

    it("starts game loop", async () => {
      Graphics.clear.mockReset();
      ctrl.scene.render.mockReset();
      ctrl.lastTime = 0;
      ctrl.dt = 1;
      await waitForSceneLoad();
      expect(ctrl.dt).toBe(0);
      expect(ctrl.lastTime).not.toBe(0);
      expect(Graphics.clear).toHaveBeenCalled();
      expect(ctrl.scene.render).toHaveBeenCalled();
    });
  });

  describe("processInput", () => {
    it("processes every item in the GameEvent input queue", () => {
      const inputQueue = GameEvent.inputQueue();
      inputQueue.add(GameEvent.click(new Vector()));
      inputQueue.add(GameEvent.collision(ctrl.hero));
      inputQueue.add(GameEvent.click(new Vector()));
      inputQueue.add(GameEvent.heroClick(ctrl.hero));
      jest.spyOn(inputQueue, "getNext");
      ctrl.processInput();
      expect(inputQueue.getNext).toHaveBeenCalledTimes(5);
    });

    it("lets scene handle non-hero clicks", () => {
      const inputQueue = GameEvent.inputQueue();
      inputQueue.add(GameEvent.click(new Vector()));
      ctrl.processInput();
      expect(ctrl.scene.onClick).toHaveBeenCalledTimes(1);
    });

    it("opens hero menu when hero is clicked", () => {
      let isHeroMenuOpen = false;
      GameEvent.on(GameEvent.OPEN_HERO_MENU, () => (isHeroMenuOpen = true));
      const inputQueue = GameEvent.inputQueue();
      inputQueue.add(GameEvent.heroClick(ctrl.hero));
      ctrl.processInput();
      expect(isHeroMenuOpen).toBe(true);
    });
  });

  describe("Camera", () => {
    let windowDimensions;
    beforeEach(() => {
      windowDimensions = {
        width: window.innerWidth,
        height: window.innerHeight
      };
      window.scroll = jest.fn();
    });

    afterEach(() => {
      window.innerWidth = windowDimensions.width;
      window.innerHeight = windowDimensions.height;
      window.scroll.mockRestore();
    });

    it("is not created when window width is >= 640 and window height is >= 480", () => {
      expect(ctrl.camera).not.toBeDefined();
    });

    it("is created when window width is < 640", async () => {
      window.innerWidth = 639;
      await window.dispatchEvent(new Event("resize"));
      expect(ctrl.camera).toBeDefined();
    });

    it("is created  when window height is < 480", async () => {
      window.innerHeight = 479;
      await window.dispatchEvent(new Event("resize"));
      expect(ctrl.camera).toBeDefined();
    });

    describe("update", () => {
      it("scrolls window", async () => {
        window.innerHeight = 479;
        await window.dispatchEvent(new Event("resize"));
        ctrl.gameLoop();
        expect(window.scroll).toHaveBeenCalledTimes(1);
      });

      it("does nothing if window is scrolled to appropriate spot already", async () => {
        window.innerHeight = 479;
        await window.dispatchEvent(new Event("resize"));
        ctrl.hero.getPosition = () => ({
          x: 512,
          y: 239.5
        });
        ctrl.gameLoop();
        expect(window.scroll).not.toHaveBeenCalled();
      });

      it("does nothing if menus are open", async () => {
        function waitForCamera() {
          return new Promise(resolve => {
            (function wait() {
              ctrl.camera ? resolve() : setTimeout(wait);
            })();
          });
        }

        window.innerHeight = 479;
        const div = document.createElement("div");
        ctrl = ReactDOM.render(<SceneDirector />, div);
        await waitForCamera();
        GameEvent.fire(GameEvent.DIALOG, "test");
        ctrl.gameLoop();
        expect(window.scroll).not.toHaveBeenCalled();
      });
    });
  });
});
