import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import GameState from "../GameState";
import Graphics from "./Graphics";
import Time from "./Time";
import Scene from "./Scene";
import SceneDirector from "./SceneDirector";
import TextureCache from "./TextureCache";
import Vector from "./Vector";

import dialog from "../../../public/dialog.json";
import Camera from "../Camera";
import { setTimeout } from "timers";
import GameEvent from "./GameEvent";

jest.mock("./Graphics");
jest.mock("./Scene");
jest.mock("../GameState");
jest.useFakeTimers();
fetch.mockResponse("{}");
let ctrl;

beforeEach(async () => {
  const div = document.createElement("div");
  ctrl = await ReactDOM.render(<SceneDirector />, div);
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
