import React, { Component } from "react";
import { LinkButton } from "../forms/controls/buttons";
import styles from "./Header.scss";
import cx from "classnames";

class Header extends Component {
  render() {
    return (
      <header className={cx(styles.header, "header")}>
        <div className={styles.selfie}>
          <a href={this.props.url} className={styles.frame}>
            <img src="/images/green_instgrm.JPG" alt="Jason Gordon portrait" />
          </a>
        </div>
        <div className={styles.messaging}>
          <h1 className={styles.title}>
            <a href={this.props.url}>Jason Gordon</a>
          </h1>
          <h2 className={styles.subtitle}>one line at a time</h2>
        </div>
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
      </header>
    );
  }
}

export default Header;
