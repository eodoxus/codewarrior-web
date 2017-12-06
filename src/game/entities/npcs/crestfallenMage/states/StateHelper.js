import GameEvent from "../../../../engine/GameEvent";

export default class StateHelper {
  static wasIntentFulfilled(entity) {
    if (entity.isHero() && entity.isIntent(GameEvent.TALK)) {
      entity.fulfillIntent();
      return true;
    }
    return false;
  }
}
