import Texture from "../Texture";
import Vector from "../Vector";
import Size from "../Size";
import TiledMap from "../map/TiledMap";

import tmxConfig from "../map/__mocks__/map.json";
const map = new TiledMap("testMap");
map.loadTMXConfig(tmxConfig);

export default class Scene {
  constructor(name) {
    this.name = name;
  }
  getEntities() {
    return [this.hero];
  }
  init = jest.fn();
  addEntity = entity => {
    if (entity.isHero()) {
      this.hero = entity;
    }
  };
  getApi = jest.fn();
  getBackgroundMusic = () => this.name;
  getName = () => this.name;
  getMap = jest.fn().mockReturnValue(map);
  onClick = jest.fn();
  removeEntity = jest.fn();
  render = jest.fn();
  renderToTexture = jest
    .fn()
    .mockReturnValue(
      new Texture("testTexture", new Vector(), new Size(10, 10))
    );
  shouldShowBorder = jest.fn();
  startBackgroundMusic = jest.fn();
  update = jest.fn();
  unload = jest.fn();
}
