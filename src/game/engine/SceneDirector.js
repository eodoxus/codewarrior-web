import * as _ from "lodash";
import React, { Component } from "react";
import styles from "./SceneDirector.scss";
import Entities from "../entities";
import Indicators from "../../components/indicators";
import Scenes from "../scenes";
import Graphics from "./Graphics";
import Size from "./Size";
import Vector from "./Vector";

const DEBUG = false;

export default class SceneDirector extends Component {
  lastTime;
  hero;
  scene;
  dt;

  constructor(props) {
    super(props);
    this.lastTime = Date.now();
    this.hero = new Entities.Hero();
    this.scene = createScene(this.props.scene, this.hero);
    this.dt = 0;

    this.state = {
      debug: DEBUG,
      dt: this.dt,
      isLoading: true
    };
  }

  onClick = e => {
    e.preventDefault();
    e.stopPropagation();
    const position = toSceneCoordinateSpace(e);
    this.scene.onClick(position);
  };

  async componentDidMount() {
    await this.scene.loadAssets();
    this.setState({ isLoading: false });
    this.updateScene();
  }

  updateScene() {
    if (!this.canvas) {
      return;
    }

    if (!Graphics.isReady()) {
      Graphics.init(this.canvas);
    }

    const now = Date.now();
    const dt = now - this.lastTime;
    this.lastTime = now;

    const size = new Size(this.props.width, this.props.height);
    this.scene.setSize(size);
    Graphics.setSize(size);
    Graphics.scale(this.props.scale);

    this.scene.update(dt);

    Graphics.clear();
    Graphics.setDrawingSurface(this.canvas);
    this.scene.render();

    if (this.state.debug) {
      this.setState({ dt: this.dt });
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
  width: 0,
  height: 0,
  scale: 1
};

function createScene(name, hero) {
  let sceneName = _.upperFirst(name);
  let sceneClass = sceneName + "Scene";
  if (!Scenes[sceneClass]) {
    throw Error(`SceneDirector does not support the "${sceneName}" scene.`);
  }
  return new Scenes[sceneClass](hero);
}

function toSceneCoordinateSpace(e) {
  const sceneBoundingRect = e.currentTarget.getBoundingClientRect();
  const sceneOriginOffset = new Vector(
    sceneBoundingRect.x,
    sceneBoundingRect.y
  );
  return new Vector(e.clientX, e.clientY)
    .subtract(sceneOriginOffset)
    .multiply(Graphics.getScale());
}
