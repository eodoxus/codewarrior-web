import GameEvent from "../../../engine/GameEvent";
import WalkingState from "./WalkingState";
import StoppedState from "./StoppedState";

export default class StateHelper {
  static beginWalking(currentState, hero, tile) {
    tile.clear();
    if (hero.movement.walkTo(tile)) {
      return new WalkingState(hero);
    }
    return currentState;
  }

  static handleCollision(currentState, hero, entity) {
    if (entity.isNpc()) {
      if (hero.behavior.isIntent(GameEvent.TALK)) {
        hero.movement.faceEntity(entity);
        hero.behavior.fulfillIntent();
        return new StoppedState(hero);
      }
      hero.movement.reroute();
    }
    return currentState;
  }

  static handleEvent(currentState, hero, event) {
    if (event.getType() === GameEvent.CLICK) {
      const tile = event.getData();
      StateHelper.setIntent(hero, tile);
      return StateHelper.beginWalking(currentState, hero, tile);
    }
    if (event.getType() === GameEvent.COLLISION) {
      return StateHelper.handleCollision(currentState, hero, event.getData());
    }
    return currentState;
  }

  static setIntent(hero, tile) {
    if (tile.hasNpc()) {
      hero.behavior.setIntent(GameEvent.talk(tile.getEntity()));
    }
  }
}
