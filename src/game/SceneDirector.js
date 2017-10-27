import * as _ from "lodash";
import React, { Component } from "react";
import styles from "./SceneDirector.scss";
import Indicators from "../components/indicators";
import { Scenes } from "./scenes";

export default class SceneDirector extends Component {
  constructor(props) {
    super(props);
    this.state = { isReady: false };
  }
  componentDidMount() {
    this.setState({ isReady: true });
  }

  onClick = e => {
    e.preventDefault();
    e.stopPropagation();
    this.scene.onClick(e.clientX, e.clientY);
  };

  render() {
    if (!this.state.isReady) {
      return (
        <div className={styles.container}>
          <Indicators.Loader />
        </div>
      );
    }

    let sceneName = _.upperFirst(this.props.scene);
    let sceneClass = sceneName + "Scene";
    if (!Scenes[sceneClass]) {
      throw Error(`SceneDirector does not support the "${sceneName}" scene.`);
    }
    const Scene = Scenes[sceneClass];
    return (
      <div className={styles.container} ref="container" onClick={this.onClick}>
        <Scene
          top="0"
          left="0"
          width="1000"
          height="1000"
          //model={model}
          ref={scene => (this.scene = scene)}
        />
      </div>
    );
  }
}
