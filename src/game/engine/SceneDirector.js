import * as _ from "lodash";
import React, { Component } from "react";
import styles from "./SceneDirector.scss";
import Entities from "../entities";
import Scenes from "../scenes";
import Time from "./Time";
import Vector from "./Vector";

export default class SceneDirector extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(this._getSceneDimensions(), {
      dt: 0,
      sprites: this.props.sprites || [initHero()]
    });
    this.lastTime = Date.now();
  }

  onClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.scene.onClick(e.clientX, e.clientY);
  };

  componentDidMount() {
    this.frameRateInterval = setInterval(
      () => this.updateScene(),
      Time.getFPSInterval()
    );
    this.updateSceneSize();
    window.addEventListener("resize", () => this.updateSceneSize());
  }

  componentWillUnmount() {
    clearInterval(this.frameRateInterval);
    window.removeEventListener("resize", () => this.updateSceneSize());
  }

  updateScene() {
    const now = Date.now();
    this.setState({ dt: now - this.lastTime });
    this.lastTime = now;
  }

  updateSceneSize() {
    this.setState(this._getSceneDimensions());
  }

  render() {
    let sceneName = _.upperFirst(this.props.scene);
    let sceneClass = sceneName + "Scene";
    if (!Scenes[sceneClass]) {
      throw Error(`SceneDirector does not support the "${sceneName}" scene.`);
    }
    const Scene = Scenes[sceneClass];
    return (
      <div className={styles.container} ref="container" onClick={this.onClick}>
        <Scene
          position={{ x: this.state.sceneLeft, y: this.state.sceneTop }}
          ref={scene => (this.scene = scene)}
          size={{
            width: this.state.sceneWidth,
            height: this.state.sceneHeight
          }}
          sprites={this.state.sprites}
          dt={this.state.dt}
          debug={this.state.debug}
        />
      </div>
    );
  }

  _getSceneDimensions() {
    return {
      sceneWidth: window.innerWidth,
      sceneHeight: window.innerHeight - this.props.top - this.props.bottom,
      sceneTop: 0,
      sceneLeft: 0
    };
  }
}

SceneDirector.defaultProps = {
  top: 0,
  bottom: 0,
  scene: "home"
};

function initHero() {
  const heroPosition = new Vector(100, 50);
  return new Entities.Hero(heroPosition);
}
