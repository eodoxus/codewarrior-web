import GameEvent from "../../../engine/GameEvent";
import WalkingState from "./WalkingState";
import StoppedState from "./StoppedState";

export default class StateHelper {
  static beginWalking(currentState, hero, tile) {
    if (hero.walkTo(tile)) {
      return new WalkingState(hero);
    }
    return currentState;
  }

  static faceEntity(hero, entity) {
    const walkingState = new WalkingState(hero);
    hero.setVelocity(hero.getFaceTowardDirection(entity));
    walkingState.updateAnimation(hero);
    new StoppedState(hero);
  }

  static handleCollision(currentState, hero, entity) {
    if (entity.isNpc()) {
      if (hero.isIntent(GameEvent.TALK)) {
        StateHelper.faceEntity(hero, entity);
        hero.fulfillIntent();
        return new StoppedState(hero);
      }
      hero.reroute();
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
      hero.setIntent(GameEvent.talk(tile.getEntity()));
    }
  }
}
