import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Time from "./Time";
import SceneDirector from "./SceneDirector";

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
      top: 0,
      bottom: 0
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

  it("handles window resize", () => {
    SceneDirector.prototype.updateSceneSize = jest.fn();
    const ctrl = getController();
    global.innerWidth = 500;
    global.innerHeight = 600;
    global.dispatchEvent(new Event("resize"));
    ctrl.updateScene();
    const size = ctrl.scene.getSize();
    expect(size.width).toBe(500);
    expect(size.height).toBe(600);
  });

  it("starts update loop", () => {
    const updateSpy = (SceneDirector.prototype.updateScene = jest.fn());
    const ctrl = getController();
    jest.runTimersToTime(1);
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("runs update loop once every frame", () => {
    const updateSpy = (SceneDirector.prototype.updateScene = jest.fn());
    const ctrl = getController();
    expect(updateSpy).not.toHaveBeenCalled();
    jest.runTimersToTime(10);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    jest.runTimersToTime(30);
    expect(updateSpy).toHaveBeenCalledTimes(3);
  });
});
