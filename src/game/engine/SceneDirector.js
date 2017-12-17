import * as _ from "lodash";
import React, { Component } from "react";
import styles from "./SceneDirector.scss";
import DialogComponent from "./DialogComponent";
import Entities from "../entities";
import GameEvent from "./GameEvent";
import Indicators from "../../components/indicators";
import Scenes from "../scenes";
import Graphics from "./Graphics";
import Size from "./Size";
import Vector from "./Vector";
import { setTimeout } from "core-js/library/web/timers";
import Tile from "./map/Tile";
import Url from "../../lib/Url";
import Time from "./Time";
import GameState from "../GameState";

const DEBUG = false;

export default class SceneDirector extends Component {
  dt;
  lastTime;
  hero;
  scene;

  constructor(props) {
    super(props);
    this.hero = new Entities.Hero();
    this.scene = createScene(this.props.scene, this.hero);

    this.state = {
      debug: DEBUG,
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

  onDoorwayTransition = doorway => {
    this.setState({ isLoading: true });
    this.scene.unload();
    setTimeout(async () => {
      this.scene = createScene(doorway.getProperty("to"), this.hero);
      await this.scene.init();
      this.hero.spawn(
        doorway.getProperty(Tile.PROPERTIES.SPAWN_HERO),
        doorway.getProperty(Tile.PROPERTIES.FACING)
      );
      this.setState({ isLoading: false });
      this.updateScene();
    });
  };

  async componentDidMount() {
    await this.scene.init();
    this.initEventListeners();
    this.setState({ isLoading: false });
    this.hero.spawn();
    this.dt = 0;
    this.lastTime = GameState.timestamp();
    this.updateScene();
  }

  initEventListeners() {
    GameEvent.on(GameEvent.DOORWAY, this.onDoorwayTransition);
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
      Graphics.setDrawingSurface(this.canvas);
      Graphics.debug = DEBUG;
    }

    const now = GameState.timestamp();
    this.dt += Math.min(Time.SECOND, now - this.lastTime);

    while (this.dt > Time.FRAME_STEP) {
      this.dt -= Time.FRAME_STEP;
      this.scene.update();
    }

    const size = new Size(this.props.width, this.props.height);
    this.scene.setSize(size);
    Graphics.setSize(size);
    Graphics.scale(this.props.scale);
    Graphics.clear();
    this.scene.render();
    this.lastTime = now;

    window.requestAnimationFrame(() => this.updateScene());
  }

  render() {
    if (this.state.isLoading) {
      return <Indicators.Loader />;
    }

    return (
      <div>
        {this.renderBorder()}
        <div
          className={styles.scene}
          ref={container => (this.container = container)}
          onClick={this.onClick}
        >
          <canvas ref={canvas => (this.canvas = canvas)} />
          <DialogComponent />
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
