export default class Scene {
  constructor(name, hero) {
    this.name = name;
    this.hero = hero;
  }
  getEntities() {
    return [this.hero];
  }
  init() {
    return Promise.resolve();
  }
  onClick = jest.fn();
  render = jest.fn();
  update = jest.fn();
  unload = jest.fn();
  shouldShowBorder = jest.fn();
}
