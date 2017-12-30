export default class Scene {
  constructor(hero) {
    this.hero = hero;
  }
  getEntities() {
    return [this.hero];
  }
  init() {
    return Promise.resolve();
  }
  render() {}
  update() {}
}
