import Entity from "../../engine/Entity";
import GameState from "../../GameState";
import GameEvent from "../../engine/GameEvent";

export default class Barrier extends Entity {
  constructor(id, properties = {}) {
    super(id, properties);
  }

  shattersOnCollisionWith(entity) {
    return (
      this.isBreakable() && entity.isHero() && entity.getBehavior().isCharging()
    );
  }

  isFulfilled() {
    const isFulfilled = GameState.getHero().getExperienceStatus(
      this.getProperty("fulfilledOn")
    );
    return isFulfilled;
  }

  handleEvent(event) {
    const entity = event.getData();
    if (
      event.getType() === GameEvent.COLLISION &&
      this.shattersOnCollisionWith(entity)
    ) {
      this.destroy();
    }
  }

  update() {
    super.update();
    if (this.isFulfilled()) {
      this.kill();
    }
  }
}
