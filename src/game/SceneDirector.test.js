import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import SceneDirector from "./SceneDirector";

describe("<SceneDirector />", () => {
  let props;
  beforeEach(function() {
    props = {};
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<SceneDirector scene="home" />, div);
  });
});
