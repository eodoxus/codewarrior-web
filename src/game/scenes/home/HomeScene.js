import Scene from "../../engine/Scene";

export default class HomeScene extends Scene {
  showBorder = true;

  getBackgroundMusic() {
    return "music/overworld.ogg";
  }

  getName() {
    return "HomeScene";
  }
}
