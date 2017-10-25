import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Header from "./Header";

describe("<Header />", () => {
  let props;
  beforeEach(function() {
    props = {
      avatar: "poo",
      email: "poody",
      home: "/",
      name: "test",
      phone: "2234",
      slogan: "herro"
    };
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <Header
        email={props.email}
        name={props.name}
        phone={props.phone}
        portrait={props.avatar}
        slogan={props.slogan}
        url={props.home}
      />,
      div
    );
  });

  it("matches expected snapshot", () => {
    const tree = renderer
      .create(
        <Header
          email={props.email}
          name={props.name}
          phone={props.phone}
          portrait={props.avatar}
          slogan={props.slogan}
          url={props.home}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
