import GameEvent from "../../../engine/GameEvent";
import State from "../../../engine/State";
import StateHelper from "./StateHelper";
import StoppedState from "./StoppedState";
import Vector from "../../../engine/Vector";

const ANIMATIONS = {
  DOWN: "walking_down",
  DOWN_LEFT: "walking_downLeft",
  DOWN_RIGHT: "walking_downRight",
  LEFT: "walking_left",
  RIGHT: "walking_right",
  UP: "walking_up",
  UP_LEFT: "walking_upLeft",
  UP_RIGHT: "walking_upRight"
};
const VELOCITY = 70;

export default class WalkingState extends State {
  enter(hero) {
    return this.updateAnimation(hero);
  }

  handleInput(hero, event) {
    if (event.getType() === GameEvent.CLICK) {
      StateHelper.beginWalking(hero, event.getData());
    }
    if (event.getType() === GameEvent.COLLISION) {
      return this.handleCollision(hero, event.getData());
    }
    return this;
  }

  handleCollision(hero, entity) {
    if (entity.isNpc()) {
      if (hero.isIntent(GameEvent.TALK)) {
        return new StoppedState(hero);
      } else {
        hero.reroute();
      }
    }
    return this;
  }

  update(hero) {
    const didMoveEnd = !hero.getCurrentMove();
    if (didMoveEnd) {
      hero.setVelocity(new Vector(VELOCITY, VELOCITY));
      const hasMoreSteps = hero.walkToNextStep();
      if (!hasMoreSteps) {
        return new StoppedState(hero);
      }
      return this;
    }
    return this.updateAnimation(hero);
  }

  updateAnimation(hero) {
    const animationName = this.getAnimationNameFromVelocity(hero.getVelocity());
    hero.getSprite().changeAnimationTo(animationName);
    return this;
  }

  getAnimationNameFromVelocity(velocity) {
    if (velocity.y > 0) {
      if (velocity.x > 0) {
        return ANIMATIONS.DOWN_RIGHT;
      } else if (velocity.x < 0) {
        return ANIMATIONS.DOWN_LEFT;
      }
      return ANIMATIONS.DOWN;
    }

    if (velocity.y === 0) {
      if (velocity.x > 0) {
        return ANIMATIONS.RIGHT;
      } else if (velocity.x < 0) {
        return ANIMATIONS.LEFT;
      }
      return ANIMATIONS.DOWN;
    }

    if (velocity.x > 0) {
      return ANIMATIONS.UP_RIGHT;
    } else if (velocity.x < 0) {
      return ANIMATIONS.UP_LEFT;
    }

    return ANIMATIONS.UP;
  }
}
