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
  render() {}
  update() {}
}
