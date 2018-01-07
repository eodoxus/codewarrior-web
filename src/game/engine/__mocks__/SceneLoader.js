import Scene from "./Scene";

export default class SceneLoader {
  hero;

  constructor(hero) {
    this.hero = hero;
  }

  find = jest.fn().mockReturnValue(this.currentScene);
  load() {
    this.currentScene = new Scene();
    this.currentScene.addEntity(this.hero);
    return this.currentScene;
  }
}
