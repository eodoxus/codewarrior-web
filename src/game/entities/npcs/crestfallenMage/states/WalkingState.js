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
  enter(mage) {
    const direction = Math.random() > 0.5 ? 1 : -1;
    mage.setVelocity(new Vector(VELOCITY * direction, 0));
    return this;
  }

  handleEvent(mage, event) {
    if (event.getType() === GameEvent.COLLISION) {
      const entity = event.getData();
      if (entity.isIntent(GameEvent.TALK)) {
        return new TalkingState(mage, entity);
      }
      return new StoppedState(mage);
    }
    return this;
  }

  update(mage) {
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
    return this.updateAnimation(mage);
  }

  updateAnimation(mage) {
    const animationName = this.getAnimationNameFromVelocity(mage.getVelocity());
    mage.getSprite().changeAnimationTo(animationName);
    return this;
  }

  getAnimationNameFromVelocity(velocity) {
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
