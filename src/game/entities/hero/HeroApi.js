import Spell from "../items/Spell";
import Vector from "../../engine/Vector";

const MAX_JUMP_DISTANCE = 24;

export default class HeroApi {
  functions;
  hero;

  constructor(hero) {
    this.hero = hero;
    this.functions = [
      "~pickTarget", // "~" prefix denotes async
      "jump"
    ];
  }

  getFunctions() {
    return this.functions;
  }

  async pickTarget(callback) {
    const behavior = this.hero.getBehavior();
    const target = behavior.isReading()
      ? await this.mockPickTarget()
      : await behavior.pickTarget();
    callback(target);
  }

  mockPickTarget() {
    return new Promise(resolve =>
      setTimeout(() => {
        Spell.log("You'll choose a target, then...");
        resolve(Vector.copy(this.hero.getPosition()));
      })
    );
  }

  jump(tile) {
    const behavior = this.hero.getBehavior();
    try {
      if (!tile) {
        throw new Error(
          "You must pass a position (x, y) to Hero's jump command"
        );
      }

      if (typeof tile.x === "undefined") {
        throw new Error(
          "The position passed to Hero's jump command requires an x coordinate"
        );
      }

      if (typeof tile.y === "undefined") {
        throw new Error(
          "The position passed to Hero's jump command requires a y coordinate"
        );
      }

      // Offset to top left of current tile
      const startingTile = Vector.subtract(
        this.hero.getOrigin(),
        new Vector(4, 4)
      );
      const distance = startingTile.distanceTo(tile);
      if (
        Math.abs(distance.x) > MAX_JUMP_DISTANCE ||
        Math.abs(distance.y) > MAX_JUMP_DISTANCE
      ) {
        throw new Error("That's too far");
      }

      behavior.isReading() ? this.mockJump(tile) : behavior.jump(tile);
    } catch (e) {
      behavior.stop();
      throw e;
    }
  }

  mockJump(tile) {
    Spell.log(`Hero will jump to the targeted position`);
  }
}
