import Audio from "./Audio";
import GameEvent from "./GameEvent";
import GameState from "../GameState";
import Scene from "./Scene";

export default class SceneLoader {
  currentScene;
  hero;
  scenes;

  constructor() {
    this.scenes = [];
  }

  find(name) {
    return this.scenes.find(scene => scene.getName() === name);
  }

  async load(sceneName) {
    this.unloadCurrentScene();
    Audio.stop();
    this.currentScene = await this.loadScene(sceneName);
    this.currentScene.addEntity(this.hero);
    GameState.restoreScene(this.currentScene);
    GameState.setSceneApi(this.currentScene.getApi());
    this.currentScene.startBackgroundMusic();
    await this.loadAdjacentScenes(this.currentScene);
    return this.currentScene;
  }

  async loadAdjacentScenes(scene) {
    return Promise.all(
      scene
        .getMap()
        .getAdjascentSceneNames()
        .map(async sceneName => await this.loadScene(sceneName))
    );
  }

  async loadScene(name) {
    const sceneName = name + (name.includes("Scene") ? "" : "Scene");
    let scene = this.find(sceneName);
    if (!scene) {
      scene = new Scene(sceneName);
      this.scenes.push(scene);
      await scene.init();
    }
    return scene;
  }

  setHero(hero) {
    this.hero = hero;
  }

  unloadCurrentScene() {
    if (!this.currentScene) {
      return;
    }
    this.hero.stop();
    GameEvent.fire(GameEvent.CLOSE_TATTERED_PAGE);
    GameState.storeScene(this.currentScene);
    GameState.storeHero(this.hero);
  }
}
