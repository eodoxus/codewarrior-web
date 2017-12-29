import JumpingState from "./states/JumpingState";
import PickingState from "./states/PickingState";
import Vector from "../../engine/Vector";

const MAX_JUMP_DISTANCE = 32;

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
    const pickingState = new PickingState(this.hero);
    this.hero.behavior.setState(pickingState);
    const target = await pickingState.getTarget();
    callback(target);
  }

  jump(tile) {
    if (!tile) {
      throw new Error("You must pass a position (x, y) to my jump command ");
    }

    if (!tile.x) {
      throw new Error(
        "The position passed to my jump command requires an x coordinate"
      );
    }

    if (!tile.x) {
      throw new Error(
        "The position passed to my jump command requires a y coordinate"
      );
    }

    // Offset to top left of current tile
    const startingTile = Vector.subtract(
      this.hero.getOrigin(),
      new Vector(4, 6)
    );
    const distance = startingTile.distanceTo(tile);
    if (
      Math.abs(distance.x) > MAX_JUMP_DISTANCE ||
      Math.abs(distance.y) > MAX_JUMP_DISTANCE
    ) {
      throw new Error("That's too far");
    }

    const position = this.hero.translateToOrigin(tile);
    this.hero.behavior.setState(new JumpingState(this.hero));
    this.hero.movement.moveTo(position);
  }
}
