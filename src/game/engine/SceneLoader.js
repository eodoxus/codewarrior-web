import Audio from "./Audio";
import GameEvent from "./GameEvent";
import GameState from "../GameState";
import Scene from "./Scene";
import Tile from "./map/Tile";
import FairyFactory from "../entities/items/FairyFactory";

export default class SceneLoader {
  currentScene;
  hero;

  fulfillExperience() {
    const experience = this.currentScene
      .getMap()
      .getProperty(Tile.PROPERTIES.EXPERIENCE);
    if (experience) {
      this.hero.fulfillExperience(experience);
    }
  }

  getBackgroundMusic() {
    if (this.currentScene) {
      return this.currentScene.getBackgroundMusic();
    }
  }

  async load(sceneName) {
    this.unloadCurrentScene();
    const previousMusic = this.getBackgroundMusic();
    this.currentScene = await this.loadScene(sceneName);
    this.switchBackgroundMusic(previousMusic);
    this.currentScene.addEntity(this.hero);
    this.currentScene.getEntities().forEach(entity => {
      entity.setMap(this.currentScene.getMap());
    });
    FairyFactory.spawnFairy();
    this.fulfillExperience();
    GameState.restoreScene(this.currentScene);
    GameState.setSceneApi(this.currentScene.getApi());
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
    const scene = new Scene(sceneName);
    await scene.init();
    const music = scene.getBackgroundMusic();
    if (music) {
      Audio.loadMusic(music);
    }
    return scene;
  }

  setHero(hero) {
    this.hero = hero;
  }

  switchBackgroundMusic(prevMusic) {
    if (!this.currentScene) {
      return;
    }
    const newMusic = this.currentScene.getBackgroundMusic();
    if (newMusic !== prevMusic || !Audio.isCurrentlyPlaying(newMusic)) {
      Audio.stop(prevMusic);
      Audio.play(newMusic);
    }
  }

  unloadCurrentScene() {
    if (!this.currentScene) {
      return;
    }
    this.currentScene.removeEntity(this.hero);
    this.currentScene.getEntities().forEach(entity => {
      entity.setMap(undefined);
    });
    this.hero.stop();
    GameEvent.removeAllListeners();
    GameEvent.fire(GameEvent.CLOSE_TATTERED_PAGE);
    GameState.storeScene(this.currentScene);
    GameState.storeHero(this.hero);
  }
}
