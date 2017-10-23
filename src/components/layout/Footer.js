import React from "react";
import styles from "./Footer.scss";
import cx from "classnames";
import { AllHtmlEntities } from "html-entities";

export default ({ copy }) => {
  copy = new AllHtmlEntities().decode(copy);
  return <footer className={cx(styles.footer, "footer")}>{copy}</footer>;
};
