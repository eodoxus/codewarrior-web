import React, { Component } from "react";
import styles from "./LinkButton.css";
import cx from "classnames";

class LinkButton extends Component {
  render() {
    console.log("styles", styles);
    return (
      <a
        href={this.props.url}
        className={cx(
          styles[this.props.className],
          "btn-" + this.props.size,
          "btn btn-default"
        )}
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className={"fa fa-" + this.props.icon} />
      </a>
    );
  }
}

export default LinkButton;
