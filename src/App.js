import React from "react";
import ModelComponent from "./components/ModelComponent";
import Layout from "./components/layout";
import { AppModel } from "./data";

export default class App extends ModelComponent {
  constructor() {
    super();

    this.model = new AppModel({
      name: "..."
    });
  }

  render() {
    return (
      <div className="app">
        <Layout.Header
          email={this.model.email}
          name={this.model.name}
          phone={this.model.phone}
          portrait={this.model.avatar}
          slogan={this.model.slogan}
          url={this.model.home}
        />
        <Layout.Footer copy={this.model.footer} />
      </div>
    );
  }
}
