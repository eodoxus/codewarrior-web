import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import { LinkButton } from "./";

describe("Buttons", () => {
  describe("<LinkButton />", () => {
    let props;
    beforeEach(function() {
      props = {
        icon: "test",
        size: "med",
        target: "_top",
        url: "somewhere.com"
      };
    });

    it("renders without crashing", () => {
      const div = document.createElement("div");
      ReactDOM.render(
        <LinkButton
          icon={props.icon}
          size={props.size}
          target={props.target}
          url={props.url}
        />,
        div
      );
    });

    it("matches expected snapshot", () => {
      const tree = renderer
        .create(
          <LinkButton
            icon={props.icon}
            size={props.size}
            target={props.target}
            url={props.url}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it(`defaults size and target props to "sm" and "_blank", respectively`, () => {
      const tree = renderer
        .create(<LinkButton icon={props.icon} url={props.url} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
