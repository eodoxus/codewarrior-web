import Scene from "../../engine/Scene";

import mapConfig from "./HomeCaveScene.map.json";

export default class HomeCaveScene extends Scene {
  getName() {
    return "HomeCaveScene";
  }

  getMapConfig() {
    return mapConfig;
  }
}
