import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Dialog from "../engine/Dialog";
import DialogComponent from "./DialogComponent";
import GameEvent from "../engine/GameEvent";

import dialog from "../../../public/dialog.json";

Dialog.load = () => {
  Dialog.text = dialog;
};

describe("<DialogComponent />", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<DialogComponent />, div);
    div.remove();
  });

  describe("Snapshots", () => {
    let node;
    beforeEach(() => {
      node = renderer.create(<DialogComponent />);
      const instance = node.getInstance();
    });

    afterEach(() => {
      GameEvent.removeAllListeners();
      node.unmount();
    });

    it("matches expected empty snapshot initially", () => {
      const tree = node.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders text dialog on dialog events", () => {
      GameEvent.fire(GameEvent.DIALOG, "test dialog");
      const tree = node.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders multiple divs for each line of dialog", () => {
      GameEvent.fire(GameEvent.DIALOG, "test dialog\nwith\nmultiple lines");
      const tree = node.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("renders a confirm dialog when confirm is present in dialog event", () => {
      GameEvent.fire(
        GameEvent.DIALOG,
        dialog["CrestfallenHome.CrestfallenMage"][2]
      );
      const tree = node.toJSON();
      expect(tree).toMatchSnapshot();
    });

    it("closes when dialog is empty", () => {
      GameEvent.fire(GameEvent.DIALOG, "test dialog");
      let tree = node.toJSON();
      expect(tree).toMatchSnapshot();

      GameEvent.fire(GameEvent.CLOSE_DIALOG);
      tree = node.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
