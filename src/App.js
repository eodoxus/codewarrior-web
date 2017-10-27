import React, { Component } from "react";
import Layout from "./components/layout";
import styles from "./App.scss";
import { AppModel } from "./data";
import Game from "./game";

const DEFAULT_ROUTE = "home";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      name: "...",
      route: DEFAULT_ROUTE
    };
  }

  async componentDidMount() {
    let model = await new AppModel().load();
    this.setState(model.toPojo());
  }

  render() {
    return (
      <div className={styles.app}>
        <Layout.Header
          email={this.state.email}
          name={this.state.name}
          phone={this.state.phone}
          portrait={this.state.avatar}
          slogan={this.state.slogan}
          url={this.state.home}
        />
        <Game.SceneDirector scene={this.state.route} />
        <Layout.Footer copy={this.state.footer} />
      </div>
    );
  }
}
