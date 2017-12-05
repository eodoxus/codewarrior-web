import GameEvent from "../../../engine/GameEvent";
import State from "../../../engine/State";
import Vector from "../../../engine/Vector";
import WalkingState from "./WalkingState";

const STOPPED_ANIMATION = "walking_down";

export default class StoppedState extends State {
  static enter(hero) {
    hero.setVelocity(new Vector());
    return StoppedState;
  }

  static handleInput(hero, event) {
    if (event.getType() === GameEvent.CLICK) {
      const tile = event.getData();
      if (tile.hasNpc()) {
        hero.setIntent(GameEvent.talk(tile.getEntity()));
      }
      hero.walkTo(tile);
      return WalkingState.enter(hero);
    }
    return StoppedState;
  }

  static update(update) {
    StoppedState.updateAnimation(update);
    return StoppedState;
  }

  static updateAnimation(hero) {
    const sprite = hero.getSprite();
    const animation = sprite.getAnimation();
    if (animation) {
      animation.stop().reset();
    } else {
      sprite.setAnimation(STOPPED_ANIMATION);
    }
  }

  static exit(hero) {
    return StoppedState;
  }
}
