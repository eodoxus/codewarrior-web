import Scene from "../../engine/Scene";

import mapConfig from "./HomeScene.map.json";

export default class HomeScene extends Scene {
  showBorder = true;

  getName() {
    return "HomeScene";
  }

  getMapConfig() {
    return mapConfig;
  }
}
