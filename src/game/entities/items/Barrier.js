import Entity from "../../engine/Entity";
import GameState from "../../GameState";

export default class Barrier extends Entity {
  isFulfilled() {
    const isFulfilled = GameState.getHero().getExperienceStatus(
      this.getProperty("fulfilledOn")
    );
    return isFulfilled;
  }

  update() {
    if (this.isFulfilled()) {
      this.die();
    }
  }
}
