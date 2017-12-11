import AnimatedSpriteGraphics from "../components/graphics/AnimatedSpriteGraphics";
import Size from "../../engine/Size";

const ANIMATION = "hero";
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
const FPS = 20;
const Z_INDEX = 1;

export default class HeroGraphics extends AnimatedSpriteGraphics {
  constructor(entity) {
    super(entity, ANIMATION, new Size(24, 32), FPS, Z_INDEX);
  }

  getStoppedAnimation() {
    return ANIMATIONS.DOWN;
  }

  pickAnimation() {
    const orientation = this.entity.movement.getOrientation();
    if (orientation.y > 0) {
      if (orientation.x > 0) {
        return ANIMATIONS.DOWN_RIGHT;
      } else if (orientation.x < 0) {
        return ANIMATIONS.DOWN_LEFT;
      }
      return ANIMATIONS.DOWN;
    }

    if (orientation.y === 0) {
      if (orientation.x > 0) {
        return ANIMATIONS.RIGHT;
      } else if (orientation.x < 0) {
        return ANIMATIONS.LEFT;
      }
      return ANIMATIONS.DOWN;
    }

    if (orientation.x > 0) {
      return ANIMATIONS.UP_RIGHT;
    } else if (orientation.x < 0) {
      return ANIMATIONS.UP_LEFT;
    }

    return ANIMATIONS.UP;
  }
}
