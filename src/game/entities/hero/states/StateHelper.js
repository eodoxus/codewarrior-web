import GameEvent from "../../../engine/GameEvent";

export default class StateHelper {
  static beginWalking(hero, tile) {
    if (tile.hasNpc()) {
      hero.setIntent(GameEvent.talk(tile.getEntity()));
    }
    hero.walkTo(tile);
  }
}
