import * as _ from "lodash";
import React, { Component } from "react";
import styles from "./SceneDirector.scss";
import Entities from "../entities";
import Indicators from "../../components/indicators";
import Scenes from "../scenes";
import Screen from "./Screen";
import Size from "./Size";
import TextureCache from "./TextureCache";
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
    this.hero = createHero();
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
    this.scene.onClick(e.clientX, e.clientY);
  };

  async componentDidMount() {
    await loadSceneAssets(this.scene);
    this.setState({ isLoading: false });
    this.updateScene();
  }

  updateScene() {
    if (!this.canvas) {
      return;
    }

    if (!Screen.isReady()) {
      Screen.init(this.canvas);
    }

    const now = Date.now();
    const dt = now - this.lastTime;
    this.lastTime = now;

    const size = new Size(this.props.width, this.props.height);
    this.scene.setSize(size);
    Screen.setSize(size);
    Screen.scale(this.props.scale);

    this.scene.update(dt);

    Screen.clear();
    Screen.setDrawingSurface(this.canvas);
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

function loadSceneAssets(scene) {
  const textures = [];
  scene.getSprites().forEach(sprite => {
    if (sprite.animations) {
      textures.push(sprite.animations.url);
    }
  });
  const map = scene.getMap();
  if (map) {
    const tilesetTexture = map.getTilesetTexture();
    if (tilesetTexture) {
      textures.push(tilesetTexture);
    }
  }
  return TextureCache.fetch(textures);
}
