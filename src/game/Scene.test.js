import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Scene from "./Scene";

describe("<Scene />", () => {
  let props;
  beforeEach(function() {
    props = {};
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Scene />, div);
  });
});
