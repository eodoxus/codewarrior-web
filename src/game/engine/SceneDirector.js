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
import Vector from "./Vector";
import Camera from "../Camera";

const DEBUG = false;
const STARTING_SCENE = "Home";
const WIDTH = 640;
const HEIGHT = 480;

export default class SceneDirector extends Component {
  camera;
  doorwayListener;
  dt;
  gameSaveSlot = 0;
  hero;
  lastTime;
  scene;

  constructor(props) {
    super(props);
    this.state = {
      debug: DEBUG,
      isLoading: true
    };
  }

  // React Component lifecycle
  async componentDidMount() {
    GameEvent.on(GameEvent.SAVE_GAME, () => GameState.save(this.gameSaveSlot));
    window.addEventListener("resize", this.initCamera);
    await GameState.load(this.gameSaveSlot);
    await this.loadScene(GameState.getLastScene() || STARTING_SCENE);
    this.initCamera();
    this.startGameLoop();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.initCamera);
    this.stopEventListeners();
  }

  shouldComponentUpdate() {
    return this.state.isLoading;
  }

  render() {
    if (this.state.isLoading) {
      return <Indicators.Loader />;
    }

    return (
      <div>
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

  // Game logic
  gameLoop() {
    if (this.state.isLoading) {
      return;
    }

    this.processInput();

    // Update scene on a fixed time step
    const now = GameState.timestamp();
    this.dt += Math.min(Time.SECOND, now - this.lastTime);
    this.lastTime = now;
    while (this.dt > Time.FRAME_STEP) {
      const beforeFrame = GameState.timestamp();
      this.scene.update();
      const frameRunTime = GameState.timestamp() - beforeFrame;
      this.dt -= Time.FRAME_STEP - frameRunTime;
    }

    if (this.camera) {
      this.camera.update();
    }

    Graphics.clear();
    this.scene.render();

    window.requestAnimationFrame(() => this.gameLoop());
  }

  initCamera() {
    if (window.innerWidth < WIDTH || window.innerHeight < HEIGHT) {
      this.camera = new Camera(this);
    }
  }

  async loadScene(name, heroPosition, heroOrientation) {
    GameState.setLastScene(name);
    await GameState.save(this.gameSaveSlot);
    this.doorwayListener = GameEvent.once(
      GameEvent.DOORWAY,
      this.onDoorwayTransition
    );
    if (!this.hero) {
      this.hero = new Entities.Hero();
      await GameState.restoreHero(this.hero);
    }
    this.scene = createScene(name, this.hero);
    await this.scene.init();
    this.hero.spawn(heroPosition, heroOrientation);
  }

  onClick = e => {
    const position = toSceneCoordinateSpace(e, this.shouldShowBorder());
    const inputQueue = GameEvent.inputQueue();
    if (this.hero.intersects(position)) {
      inputQueue.add(GameEvent.heroClick(this.hero));
    } else {
      inputQueue.add(GameEvent.click(position));
    }
  };

  onDoorwayTransition = doorway => {
    this.doorwayListener.remove();
    delete this.doorwayListener;
    closeHeroMenu();
    closeDialog();
    closeCurtain();
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
        openCurtain();
        this.startGameLoop();
      }, Math.max(0, Time.SECOND - elapsed));
    });
  };

  processInput() {
    let event = GameEvent.inputQueue().getNext();
    while (event) {
      switch (event.getType()) {
        case GameEvent.CLICK:
          closeDialog();
          this.scene.onClick(event.getData());
          break;
        case GameEvent.CLICK_HERO:
          GameEvent.fire(GameEvent.OPEN_HERO_MENU, event.getData());
          break;
        default:
          break;
      }
      event = GameEvent.inputQueue().getNext();
    }
  }

  shouldShowBorder() {
    return this.props.canShowBorder && this.scene.shouldShowBorder();
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
      toggleBorder(this.shouldShowBorder());
      this.dt = 0;
      this.lastTime = GameState.timestamp();
      this.gameLoop();
    });
  }

  stopEventListeners() {
    GameEvent.removeAllListeners();
  }
}

SceneDirector.defaultProps = {
  width: 0,
  height: 0,
  scale: 1
};

function closeCurtain() {
  GameEvent.fire(GameEvent.CLOSE_CURTAIN);
}

function closeDialog() {
  GameEvent.fire(GameEvent.DIALOG, "");
}

function closeHeroMenu() {
  GameEvent.fire(GameEvent.CLOSE_HERO_MENU);
}

function createScene(name, hero) {
  let sceneName = _.upperFirst(name);
  let sceneClass = sceneName + (sceneName.includes("Scene") ? "" : "Scene");
  if (!Scenes[sceneClass]) {
    throw Error(`SceneDirector does not support the "${sceneName}" scene.`);
  }
  return new Scenes[sceneClass](hero);
}

function openCurtain() {
  GameEvent.fire(GameEvent.OPEN_CURTAIN);
}

function toggleBorder(visible) {
  GameEvent.fire(GameEvent.HIDE_BORDER);
  if (visible) {
    GameEvent.fire(GameEvent.SHOW_BORDER);
  }
}

function toSceneCoordinateSpace(e, hasBorder) {
  const sceneBoundingRect = e.currentTarget.getBoundingClientRect();
  const sceneOriginOffset = new Vector(
    sceneBoundingRect.x,
    sceneBoundingRect.y
  );
  return new Vector(e.clientX, e.clientY)
    .subtract(sceneOriginOffset)
    .multiply(Graphics.getScale());
}
