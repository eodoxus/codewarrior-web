import React, { Component } from "react";
import Indicators from "./components/indicators";
import Layout from "./components/layout";
import styles from "./App.scss";
import { AppModel } from "./data";
import Game from "./game";

const DEFAULT_ROUTE = "home";

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      name: "...",
      route: DEFAULT_ROUTE
    };
  }

  async componentDidMount() {
    let model = await new AppModel().load();
    this.setState(model.toPojo());
    this.setState({ isLoading: false });
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
        <div className={styles.content}>{this.renderGame()}</div>
        <Layout.Footer copy={this.state.footer} />
      </div>
    );
  }

  renderGame() {
    if (this.state.isLoading) {
      return <Indicators.Loader />;
    }
    const heroPosition = new Game.Point(400, 400);
    const hero = new Game.Entities.Hero(heroPosition);
    return <Game.SceneDirector scene={this.state.route} sprites={[hero]} />;
  }
}
