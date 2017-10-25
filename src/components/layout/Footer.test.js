import React from "react";
import ReactDOM from "react-dom";
import Footer from "./Footer";

describe("<Footer />", () => {
  let props;
  beforeEach(function() {
    props = {
      footer: "footy"
    };
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Footer copy={props.footer} />, div);
  });
});
