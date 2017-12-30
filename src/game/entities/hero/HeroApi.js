import Vector from "../../engine/Vector";

const MAX_JUMP_DISTANCE = 24;

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
    const target = await this.hero.getBehavior().pickTarget();
    callback(target);
  }

  jump(tile) {
    const behavior = this.hero.getBehavior();
    try {
      if (!tile) {
        throw new Error("You must pass a position (x, y) to my jump command");
      }

      if (typeof tile.x === "undefined") {
        throw new Error(
          "The position passed to my jump command requires an x coordinate"
        );
      }

      if (typeof tile.y === "undefined") {
        throw new Error(
          "The position passed to my jump command requires a y coordinate"
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

      behavior.jump(tile);
    } catch (e) {
      behavior.stop();
      throw e;
    }
  }
}
