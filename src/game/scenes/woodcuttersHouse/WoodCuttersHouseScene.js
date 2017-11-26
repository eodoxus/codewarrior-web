import Scene from "../../engine/Scene";

import mapConfig from "./WoodCuttersHouseScene.map.json";

export default class WoodCuttersHouseScene extends Scene {
  getName() {
    return "WoodCuttersHouseScene";
  }

  getMapConfig() {
    return mapConfig;
  }
}
