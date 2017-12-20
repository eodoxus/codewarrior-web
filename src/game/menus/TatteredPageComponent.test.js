import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import GameEvent from "../engine/GameEvent";
import TatteredPageComponent from "./TatteredPageComponent";

xdescribe("<TatteredPageComponent />", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<TatteredPageComponent />, div);
    div.remove();
  });

  describe("Snapshots", () => {
    let node;
    beforeEach(() => {
      GameEvent.absorbClick = jest.fn();
      node = renderer.create(<TatteredPageComponent />);
      const instance = node.getInstance();
    });

    afterEach(() => {
      GameEvent.absorbClick.mockClear();
      GameEvent.removeAllListeners();
      node.unmount();
    });

    it("matches expected empty snapshot initially", () => {
      const tree = node.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders tattered page graphics container on open event", () => {
      GameEvent.fire(GameEvent.OPEN_TATTERED_PAGE);
      const tree = node.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders empty on close event when opened", () => {
      GameEvent.fire(GameEvent.OPEN_TATTERED_PAGE);
      GameEvent.fire(GameEvent.CLOSE_TATTERED_PAGE);
      const tree = node.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("closes when close button is clicked", () => {
      GameEvent.fire(GameEvent.OPEN_TATTERED_PAGE);
      const close = node.root.findAllByType("div")[1];
      close.props.onClick({});
      const tree = node.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("absorbs clicks on root node", () => {
      GameEvent.fire(GameEvent.OPEN_TATTERED_PAGE);
      const close = node.root.findAllByType("div")[0];
      close.props.onClick({});
      expect(GameEvent.absorbClick).toHaveBeenCalledTimes(1);
    });
  });
});
