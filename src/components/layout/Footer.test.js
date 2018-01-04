import React from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
import Footer from "./Footer";

jest.useFakeTimers();

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

  describe("snapshots", () => {
    it("collapses after a period of time when hide prop is set, then re-opens if hide prop changes to true", () => {
      const node = renderer.create(<Footer copy={props.footer} hide={true} />);
      expect(node.toJSON()).toMatchSnapshot("Open");
      jest.runTimersToTime(500);
      expect(node.toJSON()).toMatchSnapshot("Still open after 500ms");
      jest.runTimersToTime(100);
      expect(node.toJSON()).toMatchSnapshot("Collapsed after 600ms");

      node.update(<Footer copy={props.footer} hide={false} />);
      jest.runTimersToTime(500);
      expect(node.toJSON()).toMatchSnapshot("Still sclosed after 500ms");
      jest.runTimersToTime(100);
      expect(node.toJSON()).toMatchSnapshot("Open after 600ms");
      node.unmount();
    });
  });
});
