import { Component } from "react";
import { setTimeout } from "core-js/library/web/timers";

const TRANSITION_DELAY = 600;

export default class AutoCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false };
  }

  render() {
    if (this.props.hide && !this.state.collapsed) {
      setTimeout(() => {
        this.setState({ collapsed: true });
      }, TRANSITION_DELAY);
    } else if (!this.props.hide && this.state.collapsed) {
      setTimeout(() => {
        this.setState({ collapsed: false });
      }, TRANSITION_DELAY);
    }
    return;
  }

  getCollapseStyles() {
    const classes = ["collapsible"];
    if (this.state.collapsed) {
      classes.push("collapsed");
    }
    return classes.join(" ");
  }
}
