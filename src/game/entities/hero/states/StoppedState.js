import GameEvent from "../../../engine/GameEvent";
import State from "../../../engine/State";
import StateHelper from "./StateHelper";
import Vector from "../../../engine/Vector";
import WalkingState from "./WalkingState";

const STOPPED_ANIMATION = "walking_down";

export default class StoppedState extends State {
  enter(hero) {
    hero.setVelocity(new Vector());
    return this;
  }

  handleInput(hero, event) {
    if (event.getType() === GameEvent.CLICK) {
      StateHelper.beginWalking(hero, event.getData());
      return new WalkingState(hero);
    }
    return this;
  }

  update(update) {
    return this.updateAnimation(update);
  }

  updateAnimation(hero) {
    const sprite = hero.getSprite();
    const animation = sprite.getAnimation();
    if (animation) {
      animation.stop().reset();
    } else {
      sprite.setAnimation(STOPPED_ANIMATION);
    }
    return this;
  }
}
