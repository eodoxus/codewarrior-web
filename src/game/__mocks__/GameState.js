export default class GameState {
  static load() {
    return Promise.resolve();
  }
  static restoreHero() {}
  static save() {}
  static getLastScene() {
    return "Home";
  }
  static setLastScene() {}
}
