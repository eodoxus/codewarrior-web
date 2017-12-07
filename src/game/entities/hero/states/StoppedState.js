import State from "../../../engine/State";
import StateHelper from "./StateHelper";
import Vector from "../../../engine/Vector";

const STOPPED_ANIMATION = "walking_down";

export default class StoppedState extends State {
  enter(hero) {
    hero.setVelocity(new Vector());
    return this;
  }

  handleEvent(hero, event) {
    return StateHelper.handleEvent(this, hero, event);
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
