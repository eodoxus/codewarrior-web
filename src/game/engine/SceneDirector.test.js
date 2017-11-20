import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Graphics from "./Graphics";
import Time from "./Time";
import SceneDirector from "./SceneDirector";
import TextureCache from "./TextureCache";

jest.mock("./Graphics");
jest.useFakeTimers();

function getController() {
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
    const hero = ctrl.scene.getSprites()[0];
    expect(hero.id).toEqual("hero");
    expect(hero.curAnimation).toBeDefined();
    expect(hero.position).toBeDefined();
    expect(hero.animations).toBeDefined();
  });

  it("starts update loop", async () => {
    const p = Promise.resolve();
    TextureCache.fetch = () => p;
    const ctrl = getController();
    ctrl.updateScene = jest.fn();
    await p;
    expect(ctrl.updateScene).toHaveBeenCalledTimes(1);
  });

  it("runs update loop once every frame", async () => {
    window.requestAnimationFrame = jest.fn();
    const p = Promise.resolve();
    TextureCache.fetch = () => p;
    const ctrl = getController();
    await p;
    expect(window.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });
});
