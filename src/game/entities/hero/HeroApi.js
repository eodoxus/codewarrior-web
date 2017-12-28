import StoppedState from "./states/StoppedState";
import PickingState from "./states/PickingState";

export default class HeroApi {
  functions;
  hero;

  constructor(hero) {
    this.hero = hero;
    this.functions = ["~pickTarget", "jump"];
  }

  getFunctions() {
    return this.functions;
  }

  async pickTarget(callback) {
    this.hero.behavior.setState(new StoppedState(this.hero));
    const pickingState = new PickingState(this.hero);
    this.hero.behavior.setState(pickingState);
    const target = await pickingState.getTarget();
    callback(target);
  }

  jump(position) {
    if (!position) {
      throw new Error("You must pass a position (x, y) to my jump command ");
    }

    if (!position.x) {
      throw new Error(
        "The position passed to my jump command requires an x coordinate"
      );
    }

    if (!position.x) {
      throw new Error(
        "The position passed to my jump command requires a y coordinate"
      );
    }

    console.log("jump hero to", position);
  }
}
