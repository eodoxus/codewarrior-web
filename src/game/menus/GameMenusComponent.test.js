import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import GameMenus from "./GameMenusComponent";

import dialog from "../../../public/dialog.json";

beforeEach(() => {
  fetch.mockResponse(JSON.stringify(dialog));
});

describe("<GameMenus />", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<GameMenus />, div);
    div.remove();
  });

  it("matches expected snapshot", () => {
    const node = renderer.create(<GameMenus />);
    const tree = node.toJSON();
    expect(tree).toMatchSnapshot();
    node.unmount();
  });
});
