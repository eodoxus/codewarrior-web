import * as _ from "lodash";
import React, { Component } from "react";
import styles from "./SceneDirector.scss";
import Entities from "../entities";
import Indicators from "../../components/indicators";
import Scenes from "../scenes";
import Size from "./Size";
import SpriteCache from "./SpriteCache";
import Time from "./Time";
import Vector from "./Vector";

const DEBUG = false;

export default class SceneDirector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      debug: DEBUG,
      dt: 0,
      isLoading: true
    };
    this.lastTime = Date.now();
    this.hero = createHero();
    this.scene = createScene(this.props.scene, this.hero);
    this._dt = 0;
  }

  onClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.scene.onClick(e.clientX, e.clientY);
  };

  async componentDidMount() {
    await SpriteCache.fetch(this.scene.getSprites());
    this.setState({ isLoading: false });
    this.updateScene();
  }

  updateScene() {
    const now = Date.now();
    const dt = now - this.lastTime;
    const width = window.innerWidth;
    const height = window.innerHeight - this.props.top - this.props.bottom;
    this.scene.setSize(new Size(width, height));
    this.scene.update(dt);
    if (this.canvas) {
      const context = this.canvas.getContext("2d");
      this.canvas.width = width;
      this.canvas.height = height;
      if (context) {
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.scene.render(context);
      }
    }
    this.lastTime = Date.now();

    if (this.state.debug) {
      this.setState({ dt: this._dt });
    }

    window.requestAnimationFrame(() => this.updateScene());
  }

  render() {
    if (this.state.isLoading) {
      return <Indicators.Loader />;
    }
    const debug = this.state.debug ? this.scene.renderDebug() : null;
    return (
      <div className={styles.scene} ref="container" onClick={this.onClick}>
        <canvas ref={canvas => (this.canvas = canvas)} />
        {debug}
      </div>
    );
  }
}

SceneDirector.defaultProps = {
  top: 0,
  bottom: 0
};

function createHero() {
  const heroPosition = new Vector(100, 50);
  return new Entities.Hero(heroPosition);
}

function createScene(name, hero) {
  let sceneName = _.upperFirst(name);
  let sceneClass = sceneName + "Scene";
  if (!Scenes[sceneClass]) {
    throw Error(`SceneDirector does not support the "${sceneName}" scene.`);
  }
  return new Scenes[sceneClass]([hero]);
}
