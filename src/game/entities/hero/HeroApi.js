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
      throw new Error("I don't know what position to jump to");
    }

    if (!position.x) {
      throw new Error("I don't know what x coordinate to jump to");
    }

    if (!position.x) {
      throw new Error("I don't know what y coordinate to jump to");
    }

    console.log("jump hero to", position);
  }
}
