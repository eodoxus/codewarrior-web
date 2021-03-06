import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import App from "./App";
import { AppModel } from "./data";

jest.mock("./game/engine/Audio");
jest.mock("./game/engine/Graphics");
jest.mock("./game/engine/Scene");
jest.mock("./game/engine/SceneDirector");
jest.mock("./game/GameState");

describe("<App />", () => {
  beforeEach(function() {
    let model = new AppModel({
      avatar: "poo",
      email: "poody",
      footer: "footy",
      home: "/",
      name: "test",
      phone: "2234",
      slogan: "herro"
    });

    fetch.mockResponse(model.toJson());
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<App />, div);
  });

  it("matches expected snapshot", () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
