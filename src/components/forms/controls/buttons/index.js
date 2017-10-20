import React from "react";
import cx from "classnames";

function LinkButton(props) {
  return (
    <a
      href={props.url}
      className={cx("btn-" + props.size, "btn btn-default")}
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className={"fa fa-" + props.icon} />
    </a>
  );
}

export { LinkButton };
