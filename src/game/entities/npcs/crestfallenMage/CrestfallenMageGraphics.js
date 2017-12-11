import AnimatedSpriteGraphics from "../../components/graphics/AnimatedSpriteGraphics";
import Size from "../../../engine/Size";

const ANIMATION = "npcs";
const ANIMATIONS = {
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  UP: "up"
};
const FPS = 10;

export default class CrestfallenMageGraphics extends AnimatedSpriteGraphics {
  constructor(entity) {
    super(entity, ANIMATION, new Size(24, 32), FPS);
  }

  getStoppedAnimation() {
    return ANIMATIONS.DOWN;
  }

  pickAnimation() {
    const orientation = this.entity.movement.getOrientation();
    let animationName = ANIMATIONS.DOWN;
    if (orientation.y < 0) {
      animationName = ANIMATIONS.UP;
    }
    if (orientation.y === 0) {
      if (orientation.x > 0) {
        animationName = ANIMATIONS.RIGHT;
      } else if (orientation.x < 0) {
        animationName = ANIMATIONS.LEFT;
      }
    }
    return "crestfallenMage_" + animationName;
  }
}
