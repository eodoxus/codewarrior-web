import * as _ from "lodash";
import React, { Component } from "react";
import styles from "./SceneDirector.scss";
import Scenes from "../scenes";

const HEADER_HEIGHT = 76;
const FOOTER_HEIGHT = 40;
const FPS = 60;

export default class SceneDirector extends Component {
  constructor(props) {
    super(props);
    this.state = Object.assign(this._getSceneDimensions(), {
      dt: 0
    });
    this.lastTime = Date.now();
  }

  onClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.scene.onClick(e.clientX, e.clientY);
  };

  componentDidMount() {
    this._updateWindowDimensions();
    this.interval = setInterval(() => {
      const now = Date.now();
      this.setState({ dt: now - this.lastTime });
      this.lastTime = now;
    }, 1000 / FPS);
    window.addEventListener("resize", () => this._updateWindowDimensions());
  }

  componentWillUnmount() {
    clearInterval(this.interval);
    window.removeEventListener("resize", () => this._updateWindowDimensions());
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
          sprites={this.props.sprites}
          dt={this.state.dt}
          debug={this.state.debug}
        />
      </div>
    );
  }

  _getSceneDimensions() {
    return {
      sceneWidth: window.innerWidth,
      sceneHeight: window.innerHeight - HEADER_HEIGHT - FOOTER_HEIGHT,
      sceneTop: 0,
      sceneLeft: 0
    };
  }

  _updateWindowDimensions() {
    this.setState(this._getSceneDimensions());
  }
}
