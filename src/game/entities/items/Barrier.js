import Entity from "../../engine/Entity";
import BreakableGraphics from "../components/graphics/BreakableGraphics";
import GameState from "../../GameState";
import GameEvent from "../../engine/GameEvent";
import Tile from "../../engine/map/Tile";
import BreakingState from "../npcs/behaviors/states/BreakingState";

export default class Barrier extends Entity {
  isBreakable;
  breakingGraphics;

  constructor(id, properties = {}) {
    super(id, properties);
    this.isBreakable = !!this.getProperty(Tile.PROPERTIES.BREAKABLE);
  }

  isFulfilled() {
    const isFulfilled = GameState.getHero().getExperienceStatus(
      this.getProperty("fulfilledOn")
    );
    return isFulfilled;
  }

  getBreakingGraphics() {
    return this.breakingGraphics;
  }

  handleEvent(event) {
    const entity = event.getData();
    if (
      event.getType() === GameEvent.COLLISION &&
      this.isBreakable &&
      entity.isHero() &&
      entity.getBehavior().isCharging()
    ) {
      this.getBehavior().setState(new BreakingState(this));
    }
  }

  async init() {
    Entity.prototype.init.call(this);

    if (this.isBreakable) {
      this.breakingGraphics = new BreakableGraphics(this);
      await this.breakingGraphics.init();
    }
  }

  update() {
    super.update();
    if (this.isFulfilled()) {
      this.kill();
    }
  }
}
