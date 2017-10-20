import React, { Component } from "react";
import { LinkButton } from "../forms/controls/buttons";
import styles from "./Header.css";
import cx from "classnames";

class Header extends Component {
  render() {
    return (
      <header className={cx(styles.header, "header")}>
        <div className={styles.selfie}>
          <div className={styles.selfieFrame}>
            <img src="/images/green_instgrm.JPG" alt="Jason Gordon portrait" />
          </div>
        </div>
        <h1 className={styles.title}>
          Jason Gordon
          <h2 className={styles.subtitle}>one line at a time</h2>
        </h1>
        <div className={cx(styles.contact, "contact")}>
          <p className={styles.contactIcons}>
            <LinkButton
              icon="facebook"
              size="sm"
              url="https://facebook.com/eodoxus"
            />
            <LinkButton
              icon="linkedin"
              size="sm"
              url="https://www.linkedin.com/in/jasongordon"
            />
            <LinkButton
              icon="github"
              size="sm"
              url="https://github.com/eodoxus"
            />
            <LinkButton
              icon="envelope"
              size="sm"
              url={"mailto:" + this.props.email}
            />
          </p>
          <p className={styles.contactInfo}>
            {this.props.email} <br />
            {this.props.phone}
          </p>
        </div>
      </header>
    );
  }
}

export default Header;
