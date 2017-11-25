import React from "react";
import AutoCollapse from "./AutoCollapse";
import styles from "./Footer.scss";
import cx from "classnames";
import { AllHtmlEntities } from "html-entities";

export default class Footer extends AutoCollapse {
  render() {
    super.render();
    return (
      <footer
        className={cx(styles.footer, this.getCollapseStyles(), "footer")}
        ref={el => (this.el = el)}
      >
        {new AllHtmlEntities().decode(this.props.copy)}
      </footer>
    );
  }
}
