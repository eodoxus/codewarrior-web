import { Component } from "react";

const TRANSITION_DELAY = 5000;

export default class AutoCollapse extends Component {
  constructor(props) {
    super(props);
    this.state = { collapsed: false, isAuto: true };
  }

  render() {
    if (!this.state.isAuto) {
      return;
    }

    if (this.props.hide && !this.state.collapsed) {
      setTimeout(() => this.setState({ collapsed: true }), TRANSITION_DELAY);
    } else if (!this.props.hide && this.state.collapsed) {
      setTimeout(() => this.setState({ collapsed: false }), TRANSITION_DELAY);
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
