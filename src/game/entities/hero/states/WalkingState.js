import GameEvent from "../../../engine/GameEvent";
import State from "../../../engine/State";
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
  static enter(hero) {
    WalkingState.updateAnimation(hero);
    return WalkingState;
  }

  static handleInput(hero, event) {
    if (event.getType() === GameEvent.CLICK) {
      const tile = event.getData();
      if (tile.hasNpc()) {
        hero.setIntent(GameEvent.talk(tile.getEntity()));
      }
      hero.walkTo(tile);
    }
    return WalkingState;
  }

  static update(hero) {
    const didMoveEnd = !hero.getCurrentMove();
    if (didMoveEnd) {
      hero.setVelocity(new Vector(VELOCITY, VELOCITY));
      const hasMoreSteps = hero.walkToNextStep();
      if (!hasMoreSteps) {
        return StoppedState.enter(hero);
      }
    } else {
      WalkingState.updateAnimation(hero);
    }
    return WalkingState;
  }

  static exit(hero) {
    return WalkingState;
  }

  static updateAnimation(hero) {
    const animationName = WalkingState.getAnimationNameFromVelocity(
      hero.getVelocity()
    );
    const sprite = hero.getSprite();
    const curAnimation = sprite.getAnimation();
    if (curAnimation && curAnimation.getName() !== animationName) {
      curAnimation.stop().reset();
    }
    sprite.setAnimation(animationName).start();
  }

  static getAnimationNameFromVelocity(velocity) {
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
