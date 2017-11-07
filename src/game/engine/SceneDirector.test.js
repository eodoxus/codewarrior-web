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
    const hero = ctrl.state.sprites[0];
    expect(hero.id).toEqual("hero");
    expect(hero.curAnimation).toBeDefined();
    expect(hero.position).toBeDefined();
    expect(hero.animations).toBeDefined();
  });

  it("handles window resize", () => {
    SceneDirector.prototype.updateSceneSize = jest.fn();
    const ctrl = getController();
    global.innerWidth = 500;
    global.dispatchEvent(new Event("resize"));
    expect(SceneDirector.prototype.updateSceneSize).toHaveBeenCalled();
  });

  it("starts update loop", () => {
    const ctrl = getController();
    expect(ctrl.frameRateInterval).toBeDefined();
  });

  it("runs update loop once every 'frame interval'", () => {
    const updateSpy = (SceneDirector.prototype.updateScene = jest.fn());
    const ctrl = getController();
    const dt = Time.getFPSInterval();
    expect(setInterval.mock.calls.length).toBe(1);
    jest.runTimersToTime(dt - 1);
    expect(updateSpy).not.toHaveBeenCalled();
    jest.runTimersToTime(dt);
    expect(updateSpy).toHaveBeenCalled();
  });

  it("stops resize handling and update loop on unmount", () => {
    global.removeEventListener = jest.fn();
    const ctrl = getController();
    ctrl.componentWillUnmount();
    expect(global.clearInterval).toHaveBeenCalledWith(ctrl.frameRateInterval);
    expect(global.removeEventListener).toHaveBeenCalled();
  });
});
