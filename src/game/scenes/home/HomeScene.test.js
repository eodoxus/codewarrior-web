import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import HomeScene from "./HomeScene";

describe("<HomeScene />", () => {
  let props;
  beforeEach(function() {
    props = {};
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<HomeScene />, div);
  });
});
