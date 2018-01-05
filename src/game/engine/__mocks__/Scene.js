import Texture from "../Texture";
import Vector from "../Vector";
import Size from "../Size";

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
  addEntity = jest.fn();
  onClick = jest.fn();
  render = jest.fn();
  update = jest.fn();
  unload = jest.fn();
  shouldShowBorder = jest.fn();
  removeEntity = jest.fn();
  renderToTexture = jest
    .fn()
    .mockReturnValue(
      new Texture("testTexture", new Vector(), new Size(10, 10))
    );
}
