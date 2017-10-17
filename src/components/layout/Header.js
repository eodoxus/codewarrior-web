import React, { Component } from "react";
import "./Header.css";

class Header extends Component {
  render() {
    return (
      <div className="Header">
        <header className="Header-header">
          <div id="selfie">
            <img
              src="/sites/default/files/images/green_instgrm.JPG"
              alt="Jason Gordon portrait"
            />
          </div>
          <h1 className="Header-title">Jason Gordon</h1>
        </header>
        <p className="Header-contact-icons">
          <a
            href="https://facebook.com/eodoxus"
            class="btn btn-default btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa fa-facebook" />
          </a>
          <a
            href="https://www.linkedin.com/in/jasongordon"
            class="btn btn-default btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa fa-linkedin" />
          </a>
          <a
            class="btn btn-default btn-sm"
            href="https://github.com/eodoxus"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa fa-github" />
          </a>
          <a href="mailto:" class="btn btn-default btn-sm">
            <i class="fa fa-envelope" />
          </a>
        </p>
      </div>
    );
  }
}

export default Header;
