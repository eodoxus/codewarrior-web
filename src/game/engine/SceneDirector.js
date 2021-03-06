import React, { Component } from "react";
import styles from "./SceneDirector.scss";
import Audio from "./Audio";
import Camera from "../Camera";
import GameMenus from "../menus/GameMenusComponent";
import Entities from "../entities";
import GameEvent from "./GameEvent";
import GameState from "../GameState";
import Graphics from "./Graphics";
import Indicators from "../../components/indicators";
import SceneLoader from "./SceneLoader";
import SceneTransitioner from "./SceneTransitioner";
import Size from "./Size";
import TatteredPage from "../entities/items/TatteredPage";
import Tile from "./map/Tile";
import Time from "./Time";
import Vector from "./Vector";

const DEBUG = false;
const DYING_DURATION = 1200;
const STARTING_SCENE = "Home";
const WIDTH = 640;
const HEIGHT = 480;

export default class SceneDirector extends Component {
  static SIZE = new Size(WIDTH, HEIGHT);

  camera;
  dt;
  gameSaveSlot = 0;
  hero;
  lastTime;
  gameEventListeners;
  sceneLoader;

  constructor(props) {
    super(props);
    this.state = {
      debug: DEBUG,
      isLoading: true
    };
    this.gameEventListeners = [];
  }

  // React Component lifecycle
  componentDidMount() {
    window.addEventListener("resize", this.initCamera);
    document.addEventListener("keyup", this.onKeyUp);
  }

  async componentWillMount() {
    await GameState.load(this.gameSaveSlot);
    await Audio.loadSoundEffects();
    this.onRestart();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.initCamera);
    document.removeEventListener("keyup", this.onKeyUp);
    this.stopSceneEventListeners();
    this.gameEventListeners.forEach(listener => listener.remove());
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
          id="scene"
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
  gameLoop(timestamp) {
    if (this.state.isLoading) {
      return;
    }

    this.processInput();

    // Update scene on a fixed time step
    const now = timestamp || Time.timestamp();
    this.dt += Math.min(Time.SECOND, now - this.lastTime);
    this.lastTime = now;
    while (this.dt > Time.FRAME_STEP) {
      const beforeFrame = Time.timestamp();
      this.scene.update();
      const frameRunTime = Time.timestamp() - beforeFrame;
      this.dt -= Time.FRAME_STEP - frameRunTime;
    }

    if (this.camera) {
      this.camera.update();
    }

    Graphics.clear();
    this.scene.render();

    window.requestAnimationFrame(() => this.gameLoop());
  }

  initCamera = e => {
    if (window.innerWidth < WIDTH || window.innerHeight < HEIGHT) {
      this.camera = new Camera(this);
    }
  };

  async loadScene(name) {
    GameState.setLastScene(name);
    await GameState.save(this.gameSaveSlot);
    this.doorwayListener && this.doorwayListener.remove();
    this.doorwayListener = GameEvent.once(
      GameEvent.DOORWAY,
      this.onDoorwayTransition
    );
    this.transitionListener && this.transitionListener.remove();
    this.transitionListener = GameEvent.once(
      GameEvent.TRANSITION,
      this.onSceneTransition
    );
    if (!this.sceneLoader) {
      this.sceneLoader = new SceneLoader();
    }
    this.sceneLoader.setHero(this.hero);
    this.scene = await this.sceneLoader.load(name);
    closeHeroMenu();
    closeDialog();
  }

  onClick = e => {
    if (this.state.isLoading || this.hero.isDead()) {
      return;
    }
    const position = toSceneCoordinateSpace(e, this.shouldShowBorder());
    const inputQueue = GameEvent.inputQueue();
    if (this.hero.intersects(position)) {
      inputQueue.add(GameEvent.heroClick(this.hero));
    } else {
      inputQueue.add(GameEvent.click(position));
    }
  };

  onDoorwayTransition = doorway => {
    closeCurtain();
    this.setState({ isLoading: true });
    this.stopSceneEventListeners();

    // Need to wait until current iteration of requestAnimationFrame
    // finishes before switching scenes
    setTimeout(async () => {
      const timer = Time.timestamp();
      await this.loadScene(doorway.getSceneName());
      this.hero.spawn(
        doorway.getProperty(Tile.PROPERTIES.SPAWN_HERO),
        doorway.getProperty(Tile.PROPERTIES.ORIENTATION)
      );
      const elapsed = Time.timestamp() - timer;
      setTimeout(() => {
        openCurtain();
        this.startGameLoop();
      }, Math.max(0, Time.SECOND - elapsed));
    });
  };

  onHeroDeath = () => {
    Audio.stop();
    this.scene.removeEntity(this.hero);
    setTimeout(() => {
      this.setState({ isLoading: true });
    }, DYING_DURATION);
  };

  onKeyUp = e => {
    switch (e.key) {
      case " ":
        return GameEvent.inputQueue().add(GameEvent.heroClick(this.hero));
      case "Escape":
        closeDialog();
        closeHeroMenu();
        closeTatteredPage();
        break;
      default:
        const spellKeys = ["1", "2", "3", "4", "5"];
        if (spellKeys.includes(e.key)) {
          return this.onSpellKeyPressed(e.key);
        }
    }
  };

  onRestart = async () => {
    Audio.stop();
    this.hero = new Entities.Hero();
    await GameState.restoreHero(this.hero);
    await this.hero.init();
    await this.loadScene(GameState.getLastScene() || STARTING_SCENE);
    this.hero.spawn();
    this.initCamera();
    this.startGameLoop();

    this.gameEventListeners.forEach(listener => listener.remove());
    this.gameEventListeners = [
      GameEvent.on(GameEvent.SAVE_GAME, () =>
        GameState.save(this.gameSaveSlot)
      ),
      GameEvent.on(GameEvent.HERO_DEATH, this.onHeroDeath),
      GameEvent.on(GameEvent.RESTART, this.onRestart)
    ];
  };

  onSceneTransition = transition => {
    this.setState({ isLoading: true });
    this.stopSceneEventListeners();

    // Need to wait until current iteration of requestAnimationFrame
    // finishes before switching scenes
    setTimeout(async () => {
      const prevScene = this.scene;
      await this.loadScene(transition.getSceneName());
      await new SceneTransitioner(
        this.hero,
        prevScene,
        this.scene,
        transition,
        SceneDirector.SIZE
      ).animate();
      this.startGameLoop();
    });
  };

  async onSpellKeyPressed(spellNum) {
    spellNum = parseInt(spellNum, 10) - 1;
    const inventory = this.hero.getInventory();
    const tatteredPage = inventory.get(TatteredPage.NAME);
    if (tatteredPage) {
      const spell = tatteredPage.getSpell(spellNum);
      if (spell) {
        try {
          await spell.cast();
        } catch (e) {}
      }
    }
  }

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
    return !!this.props.canShowBorder && this.scene.shouldShowBorder();
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
      this.lastTime = Time.timestamp();
      this.gameLoop();
    });
  }

  stopSceneEventListeners() {
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
  GameEvent.fire(GameEvent.CLOSE_DIALOG);
}

function closeHeroMenu() {
  GameEvent.fire(GameEvent.CLOSE_HERO_MENU);
}

function closeTatteredPage() {
  GameEvent.fire(GameEvent.CLOSE_TATTERED_PAGE);
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
