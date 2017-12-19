import * as _ from "lodash";
import React, { Component } from "react";
import styles from "./SceneDirector.scss";
import GameMenus from "../menus/GameMenusComponent";
import Entities from "../entities";
import GameEvent from "./GameEvent";
import GameState from "../GameState";
import Graphics from "./Graphics";
import Indicators from "../../components/indicators";
import Scenes from "../scenes";
import Size from "./Size";
import Tile from "./map/Tile";
import Time from "./Time";
import Url from "../../lib/Url";
import Vector from "./Vector";

const DEBUG = false;
const STARTING_SCENE = "Home";

export default class SceneDirector extends Component {
  dt;
  lastTime;
  hero;
  scene;

  constructor(props) {
    super(props);
    this.state = {
      debug: DEBUG,
      isLoading: true
    };
  }

  onClick = e => {
    GameEvent.absorbClick(e);
    closeDialog();
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
    GameEvent.fire(GameEvent.CLOSE_CURTAIN);
    this.setState({ isLoading: true });
    this.stopEventListeners();
    this.scene.unload();

    // Need to wait until current iteration of requestAnimationFrame
    // finishes before switching scenes
    setTimeout(async () => {
      const timer = GameState.timestamp();
      await this.loadScene(
        doorway.getProperty("to"),
        doorway.getProperty(Tile.PROPERTIES.SPAWN_HERO),
        doorway.getProperty(Tile.PROPERTIES.FACING)
      );
      const elapsed = GameState.timestamp() - timer;
      setTimeout(() => {
        GameEvent.fire(GameEvent.OPEN_CURTAIN);
        this.startGameLoop();
      }, Math.max(0, Time.SECOND - elapsed));
    });
  };

  async componentDidMount() {
    await this.loadScene(STARTING_SCENE);
    this.startGameLoop();
  }

  componentWillUnmount() {
    this.stopEventListeners();
  }

  async loadScene(name, heroPosition, heroOrientation) {
    this.initEventListeners();
    if (!this.hero) {
      this.hero = new Entities.Hero();
    }
    this.scene = createScene(name, this.hero);
    await this.scene.init();
    this.hero.spawn(heroPosition, heroOrientation);
  }

  gameLoop() {
    if (this.state.isLoading) {
      return;
    }

    // Update scene on a fixed time step
    const now = GameState.timestamp();
    this.dt += Math.min(Time.SECOND, now - this.lastTime);
    while (this.dt > Time.FRAME_STEP) {
      this.dt -= Time.FRAME_STEP;
      this.scene.update();
    }

    Graphics.clear();
    this.scene.render();
    this.lastTime = now;

    window.requestAnimationFrame(() => this.gameLoop());
  }

  initEventListeners() {
    GameEvent.on(GameEvent.DOORWAY, this.onDoorwayTransition);
  }

  shouldComponentUpdate() {
    return this.state.isLoading;
  }

  startGameLoop() {
    this.setState({ isLoading: false });

    // Need to wait until current React renders DOM elements before
    // Graphics can begin drawing
    setTimeout(() => {
      const size = new Size(this.props.width, this.props.height);
      Graphics.debug = DEBUG;
      Graphics.setDrawingSurface(this.canvas);
      Graphics.setSize(size);
      Graphics.scale(this.props.scale);
      this.dt = 0;
      this.lastTime = GameState.timestamp();
      this.gameLoop();
    });
  }

  stopEventListeners() {
    GameEvent.removeAllListeners();
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
          <GameMenus />
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

function closeDialog() {
  GameEvent.fire(GameEvent.DIALOG, "");
}

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
