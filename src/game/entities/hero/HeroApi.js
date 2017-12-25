import Vector from "../../engine/Vector";

export default class HeroApi {
  functions;
  hero;
  constructor(hero) {
    this.hero = hero;
    this.functions = ["pickTarget", "jump"];
  }

  getFunctions() {
    return this.functions;
  }

  pickTarget() {
    console.log("this should bring up a target cursor");
    return new Vector(10, 15);
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
