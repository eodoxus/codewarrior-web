import AnimatedSprite from "../../../engine/AnimatedSprite";
import CrestfallenMage from "./CrestfallenMage";
import Size from "../../../engine/Size";

const ANIMATIONS = {
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  UP: "up"
};

export default class CrestfallenMageSprite extends AnimatedSprite {
  static FPS = 10;

  constructor() {
    super("npcs", new Size(20, 24), CrestfallenMageSprite.FPS);
  }

  getStateAnimationName(state, velocity) {
    let animationName;
    switch (state) {
      case CrestfallenMage.STATES.WALKING:
        animationName = this.getWalkingAnimation(velocity);
        break;
      default:
        animationName = ANIMATIONS.DOWN;
        break;
    }
    return CrestfallenMage.ID + "_" + animationName;
  }

  getWalkingAnimation(velocity) {
    if (velocity.y < 0) {
      return ANIMATIONS.UP;
    }

    if (velocity.y === 0) {
      if (velocity.x > 0) {
        return ANIMATIONS.RIGHT;
      } else if (velocity.x < 0) {
        return ANIMATIONS.LEFT;
      }
    }

    return ANIMATIONS.DOWN;
  }

  pickAnimation(state, velocity) {
    const nextAnimation = this.getStateAnimationName(state, velocity);
    if (!this.getAnimation()) {
      this.setAnimation(nextAnimation);
    }

    if (this.getAnimation().getName() !== nextAnimation) {
      this.getAnimation()
        .stop()
        .reset();
      this.setAnimation(nextAnimation).start();
    }
  }
}
