import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import GameMenus from "./GameMenusComponent";

import dialog from "../../../public/dialog.json";
import GameEvent from "../engine/GameEvent";
import Vector from "../engine/Vector";

const mockHero = {
  getPosition: () => new Vector(0, 0),
  getInventory: () => {
    return {
      get: () => {
        return {
          getSpells: () => []
        };
      }
    };
  }
};

beforeEach(() => {
  fetch.mockResponse(JSON.stringify(dialog));
});

describe("<GameMenus />", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<GameMenus />, div);
    div.remove();
  });

  describe("Snapshots", () => {
    it("matches default snapshot", () => {
      const node = renderer.create(<GameMenus />);
      const tree = node.toJSON();
      expect(tree).toMatchSnapshot();
      node.unmount();
    });

    it("has hero menu when hero menu is opened snapshot", () => {
      const node = renderer.create(<GameMenus />);
      GameEvent.fire(GameEvent.OPEN_HERO_MENU, mockHero);
      const tree = node.toJSON();
      expect(tree).toMatchSnapshot();
      node.unmount();
    });

    it("has dialog when a dialog is active", () => {
      const node = renderer.create(<GameMenus />);
      GameEvent.fire(GameEvent.DIALOG, "test dialog");
      const tree = node.toJSON();
      expect(tree).toMatchSnapshot();
      node.unmount();
    });
  });
});
