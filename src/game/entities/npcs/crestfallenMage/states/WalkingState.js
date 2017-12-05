import CrestfallenMage from "../CrestfallenMage";
import GameEvent from "../../../../engine/GameEvent";
import State from "../../../../engine/State";
import StoppedState from "./StoppedState";
import TalkingState from "./TalkingState";
import Vector from "../../../../engine/Vector";

const ANIMATIONS = {
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  UP: "up"
};
const PACING_DISTANCE = 40;
const VELOCITY = 10;

export default class WalkingState extends State {
  static enter(mage) {
    const direction = Math.random() > 0.5 ? 1 : -1;
    mage.setVelocity(new Vector(VELOCITY * direction, 0));
    return WalkingState;
  }

  static handleInput(mage, event) {
    if (event.getType() === GameEvent.COLLISION) {
      const entity = event.getData();
      if (entity.isHero() && entity.isIntent(GameEvent.TALK)) {
        entity.fulfillIntent();
        return TalkingState.enter(mage, entity);
      }
      return StoppedState.enter(mage);
    }
    return WalkingState;
  }

  static update(mage) {
    const curPosition = mage.getPosition();
    const originalPosition = mage.getOriginalPosition();
    const minX = originalPosition.x - PACING_DISTANCE;
    const maxX = originalPosition.x + PACING_DISTANCE;
    if (curPosition.x <= minX) {
      curPosition.x = minX;
      mage.getVelocity().multiply(-1);
    }
    if (curPosition.x >= maxX) {
      curPosition.x = maxX;
      mage.getVelocity().multiply(-1);
    }
    WalkingState.updateAnimation(mage);
    return WalkingState;
  }

  static exit() {
    return WalkingState;
  }

  static updateAnimation(mage) {
    const animationName = WalkingState.getAnimationNameFromVelocity(
      mage.getVelocity()
    );
    const sprite = mage.getSprite();
    const curAnimation = sprite.getAnimation();
    if (curAnimation && curAnimation.getName() !== animationName) {
      curAnimation.stop().reset();
    }
    sprite.setAnimation(animationName).start();
  }

  static getAnimationNameFromVelocity(velocity) {
    let animationName = ANIMATIONS.DOWN;
    if (velocity.y < 0) {
      animationName = ANIMATIONS.UP;
    }
    if (velocity.y === 0) {
      if (velocity.x > 0) {
        animationName = ANIMATIONS.RIGHT;
      } else if (velocity.x < 0) {
        animationName = ANIMATIONS.LEFT;
      }
    }
    return CrestfallenMage.ID + "_" + animationName;
  }
}
