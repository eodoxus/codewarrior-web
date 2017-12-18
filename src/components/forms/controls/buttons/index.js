import React from "react";
import cx from "classnames";

let Button = ({ text, onClick }) => (
  <button className={cx("btn btn-default btn-confirm")} onClick={onClick}>
    {text}
  </button>
);

let LinkButton = ({ icon, size, target, url }) => (
  <a
    href={url}
    className={cx("btn-" + size, "btn btn-default")}
    target={target}
    rel="noopener noreferrer"
  >
    <i className={cx("fa", icon ? "fa-" + icon : "")} />
  </a>
);

LinkButton.defaultProps = {
  size: "sm",
  target: "_blank"
};

export { Button, LinkButton };
