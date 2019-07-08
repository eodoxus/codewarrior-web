import React from "react";
import AutoCollapse from "./AutoCollapse";
import { LinkButton } from "../forms/controls/buttons";
import styles from "./Header.scss";
import cx from "classnames";

export default class Header extends AutoCollapse {


  handleToggleBtnClick() {
    this.setState({isAuto: false, collapsed: !this.state.collapsed});
  }

  render() {
    super.render();
    return (
      <header className={cx(styles.header, this.getCollapseStyles(), "header")}>
        <div className={styles.selfie}>
          <a href={this.props.url} className={styles.frame}>
            <img
              src={this.props.portrait}
              alt={this.props.name + " portrait"}
            />
          </a>
        </div>
        <div className={styles.messaging}>
          <h1 className={styles.title}>
            <a href={this.props.url}>{this.props.name}</a>
          </h1>
          <h2 className={styles.subtitle}>{this.props.slogan}</h2>
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
          <span className={styles.phone}>
            <LinkButton
              icon="phone"
              size="sm"
              target="_top"
              url={"tel:" + this.props.phone}
            />
          </span>
          <LinkButton
            icon="envelope"
            size="sm"
            target="_top"
            url={"mailto:" + this.props.email}
          />
        </p>
        <p className={styles.contactInfo}>
          {this.props.email} <br />
          {this.props.phone}
        </p>
        {this.renderToggleButton()}
      </header>
    );
  }

  renderToggleButton() {
    return (
      <div className={styles.toggleButton} onClick={() => this.handleToggleBtnClick()}>
        <i className="fa fa-chevron-up" />
      </div>
    );
  }
}
