import Scene from "../../engine/Scene";

export default class HomeCaveScene extends Scene {
  getBackgroundMusic() {
    return "music/cave.ogg";
  }

  getName() {
    return "HomeCaveScene";
  }
}
