import React, { Component } from "react";
import Indicators from "./components/indicators";
import Layout from "./components/layout";
import styles from "./App.scss";
import { AppModel } from "./data";
import Game from "./game";

const DEFAULT_ROUTE = "home";
const HEADER_HEIGHT = 76;
const FOOTER_HEIGHT = 40;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      name: "...",
      route: DEFAULT_ROUTE
    };
  }

  componentDidCatch(error, info) {
    this.setState({
      hasError: true,
      error: error
    });
  }

  async componentWillMount() {
    let model = await new AppModel().load();
    this.setState(model.toPojo());
    if (!this.state.hasError) {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const content = this.state.hasError
      ? this.renderError()
      : this.renderGame();
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
        <div className={styles.content}>{content}</div>
        <Layout.Footer copy={this.state.footer} />
      </div>
    );
  }

  renderError() {
    return <div className={styles.error}>{this.state.error.message}</div>;
  }

  renderGame() {
    if (this.state.isLoading) {
      return <Indicators.Loader />;
    }
    return (
      <Game.SceneDirector
        scene={this.state.route}
        top={HEADER_HEIGHT}
        bottom={FOOTER_HEIGHT}
      />
    );
  }
}
