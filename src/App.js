import React, { Component } from "react";
import cx from "classnames";
import Indicators from "./components/indicators";
import Layout from "./components/layout";
import styles from "./App.scss";
import { AppModel } from "./data";
import Game from "./game";
import Url from "./lib/Url";

const DEFAULT_ROUTE = "home";
const GAME_WIDTH = 640;
const GAME_HEIGHT = 480;
const CHROME_HEIGHT = 76 + 40; // header + footer

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

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

  async componentWillMount() {
    let model = await new AppModel().load();
    this.setState(model.toPojo());
    if (!this.state.hasError) {
      this.setState({ isLoading: false });
    }
    this.updateDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  onBorderClick = e => {
    e.currentTarget = this.sceneDirector.container;
    this.sceneDirector && this.sceneDirector.onClick(e);
  };

  render() {
    const content = this.state.hasError
      ? this.renderError()
      : this.renderGame();
    return (
      <div
        className={cx(
          this.state.centerHorizontally ? styles.centerVertically : "",
          this.state.centerVertically ? styles.centerVertically : "",
          styles.app
        )}
      >
        <Layout.Header
          email={this.state.email}
          name={this.state.name}
          phone={this.state.phone}
          portrait={this.state.avatar}
          slogan={this.state.slogan}
          url={this.state.home}
          hide={this.state.hideChrome}
        />
        <div className={styles.content}>{content}</div>
        <Layout.Footer copy={this.state.footer} hide={this.state.hideChrome} />
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
    let border;
    if (this.state.hasBorder) {
      border = (
        <div
          className={styles.border}
          style={{
            backgroundImage: `url(${Url.PUBLIC}/images/game-border.png)`
          }}
          onClick={this.onBorderClick}
        />
      );
    }
    return (
      <div className={styles.game}>
        {border}
        <Game.SceneDirector
          scene={this.state.route}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          scale="2.5"
          ref={sceneDirector => (this.sceneDirector = sceneDirector)}
        />
      </div>
    );
  }

  updateDimensions = () => {
    const stateChanges = {
      hasBorder: false,
      centerHorizontally: false,
      centerVertically: false,
      hideChrome: false
    };
    if (window.innerWidth > GAME_WIDTH) {
      stateChanges.hasBorder = true;
      stateChanges.centerHorizontally = true;
    }
    if (window.innerHeight > GAME_HEIGHT) {
      stateChanges.centerVertically = true;
    }
    if (window.innerHeight <= GAME_HEIGHT + CHROME_HEIGHT) {
      stateChanges.hideChrome = true;
    }
    if (Object.keys(stateChanges).length) {
      this.setState(stateChanges);
    }
  };
}
