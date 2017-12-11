import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Graphics from "./Graphics";
import Time from "./Time";
import Scene from "./Scene";
import SceneDirector from "./SceneDirector";
import TextureCache from "./TextureCache";
import Vector from "./Vector";

import dialog from "../../../public/dialog.json";

jest.mock("./Graphics");
jest.useFakeTimers();

Scene.prototype.init = () => Promise.resolve();
Scene.prototype.render = () => true;
Scene.prototype.update = () => true;

function getController() {
  fetch.mockResponse(JSON.stringify(dialog));
  const div = document.createElement("div");
  return ReactDOM.render(<SceneDirector scene="home" />, div);
}

afterEach(() => {
  setInterval.mockClear();
});

describe("<SceneDirector />", () => {
  it("sets default props", () => {
    const ctrl = getController();
    expect(ctrl.props).toEqual({
      scene: "home",
      width: 0,
      height: 0,
      scale: 1
    });
  });

  it("initializes hero", () => {
    const ctrl = getController();
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
      const ctrl = getController();
      ctrl.hero.intersects = jest.fn();
      ctrl.scene.onClick = jest.fn();
      ctrl.onClick(mockEvent);
      expect(ctrl.scene.onClick).toHaveBeenCalledWith(new Vector(20, 40));
    });

    it("doesn't send click to scene if hero was clicked", () => {
      const ctrl = getController();
      ctrl.hero.intersects = jest.fn();
      ctrl.hero.intersects.mockReturnValue(true);
      ctrl.scene.onClick = jest.fn();
      ctrl.onClick(mockEvent);
      expect(ctrl.scene.onClick).not.toHaveBeenCalled();
    });
  });
});
