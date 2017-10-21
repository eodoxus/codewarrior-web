import React, { Component } from "react";
import Layout from "./components/layout";
import { AppModel } from "./data";

class App extends Component {
  model = new AppModel();

  componentDidMount() {
    this.model.load().then(() => this.forceUpdate());
  }

  render() {
    return (
      <Layout.Header
        email={this.model.email}
        name={this.model.name}
        phone={this.model.phone}
        slogan={this.model.slogan}
        url={this.model.home}
      />
    );
  }
}

export default App;
