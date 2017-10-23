import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { AppModel } from "./data";

describe("App", () => {
  beforeEach(function() {
    let model = new AppModel({
      avatar: "poo",
      email: "poody",
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
});
