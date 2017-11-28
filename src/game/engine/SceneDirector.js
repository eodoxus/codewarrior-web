import * as _ from "lodash";
import React, { Component } from "react";
import styles from "./SceneDirector.scss";
import Event from "../../lib/Event";
import Entities from "../entities";
import Indicators from "../../components/indicators";
import Scenes from "../scenes";
import Graphics from "./Graphics";
import Size from "./Size";
import Vector from "./Vector";
import { setTimeout } from "core-js/library/web/timers";
import Tile from "./map/Tile";
import Url from "../../lib/Url";

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
    const hasBorder = this.props.canShowBorder && this.scene.shouldShowBorder();
    const position = toSceneCoordinateSpace(e, hasBorder);
    if (this.hero.intersects(position)) {
      // TODO: handle click on hero
      console.log("hero clicked");
    } else {
      this.scene.onClick(position);
    }
  };

  onTransition = doorway => {
    this.setState({ isLoading: true });
    this.scene.unload();
    setTimeout(async () => {
      this.scene = createScene(doorway.getProperty("to"), this.hero);
      await this.scene.loadAssets();
      this.scene.spawnHero(
        doorway.getProperty(Tile.PROPERTIES.SPAWN_HERO),
        doorway.getProperty(Tile.PROPERTIES.FACING)
      );
      this.setState({ isLoading: false });
      this.updateScene();
    });
  };

  async componentDidMount() {
    await this.scene.loadAssets();
    Event.on(Event.TRANSITION, this.onTransition);
    this.setState({ isLoading: false });
    this.scene.spawnHero();
    this.updateScene();
  }

  shouldComponentUpdate() {
    return this.state.isLoading;
  }

  updateScene() {
    if (this.state.isLoading) {
      return;
    }

    if (!Graphics.isReady()) {
      Graphics.init(this.canvas);
      Graphics.debug = DEBUG;
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
      <div>
        {this.renderBorder()}
        <div
          className={styles.scene}
          ref={container => (this.container = container)}
          onClick={this.onClick}
        >
          <canvas ref={canvas => (this.canvas = canvas)} />
          {debug}
        </div>
      </div>
    );
  }

  renderBorder() {
    if (this.props.canShowBorder && this.scene.shouldShowBorder()) {
      return (
        <div
          className={styles.border}
          style={{
            backgroundImage: `url(${Url.PUBLIC}/images/game-border.png)`
          }}
          onClick={this.onClick}
        />
      );
    }
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

function toSceneCoordinateSpace(e, hasBorder) {
  const sceneBoundingRect = e.currentTarget.getBoundingClientRect();
  const sceneOriginOffset = new Vector(
    sceneBoundingRect.x,
    sceneBoundingRect.y
  );
  if (hasBorder) {
    const borderOffset = {
      x: 14,
      y: 11
    };
    sceneOriginOffset.x += borderOffset.x;
    sceneOriginOffset.y += borderOffset.y;
  }
  return new Vector(e.clientX, e.clientY)
    .subtract(sceneOriginOffset)
    .multiply(Graphics.getScale());
}
