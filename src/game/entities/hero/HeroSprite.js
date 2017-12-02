import AnimatedSprite from "../../engine/AnimatedSprite";
import Hero from "./Hero";
import Size from "../../engine/Size";

const ANIMATIONS = {
  PICKING_UP: "pickingUp",
  READING: "reading",
  WALKING: {
    DOWN: "walking_down",
    DOWN_LEFT: "walking_downLeft",
    DOWN_RIGHT: "walking_downRight",
    LEFT: "walking_left",
    RIGHT: "walking_right",
    UP: "walking_up",
    UP_LEFT: "walking_upLeft",
    UP_RIGHT: "walking_upRight"
  }
};

export default class HeroSprite extends AnimatedSprite {
  static FPS = 20;

  constructor() {
    super("hero", new Size(24, 32), HeroSprite.FPS);
  }

  getStateAnimationName(state, velocity) {
    switch (state) {
      case Hero.STATES.PICKING_UP:
        return ANIMATIONS.PICKING_UP;
      case Hero.STATES.READING:
        return ANIMATIONS.READING;
      case Hero.STATES.WALKING:
      case Hero.STATES.RUNNING:
        return this.getWalkingAnimation(velocity);
      default:
        return ANIMATIONS.WALKING.DOWN;
    }
  }

  getWalkingAnimation(velocity) {
    if (velocity.y > 0) {
      if (velocity.x > 0) {
        return ANIMATIONS.WALKING.DOWN_RIGHT;
      } else if (velocity.x < 0) {
        return ANIMATIONS.WALKING.DOWN_LEFT;
      }
      return ANIMATIONS.WALKING.DOWN;
    }

    if (velocity.y === 0) {
      if (velocity.x > 0) {
        return ANIMATIONS.WALKING.RIGHT;
      } else if (velocity.x < 0) {
        return ANIMATIONS.WALKING.LEFT;
      }
      return ANIMATIONS.WALKING.DOWN;
    }

    if (velocity.x > 0) {
      return ANIMATIONS.WALKING.UP_RIGHT;
    } else if (velocity.x < 0) {
      return ANIMATIONS.WALKING.UP_LEFT;
    }

    return ANIMATIONS.WALKING.UP;
  }
}
