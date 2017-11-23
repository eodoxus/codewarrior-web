import Scene from "../../engine/Scene";

import mapConfig from "./HomeScene.map.json";

export default class HomeScene extends Scene {
  getName() {
    return "HomeScene";
  }

  getMapConfig() {
    return mapConfig;
  }
}
