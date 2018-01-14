import AnimatedSpriteGraphics from "./AnimatedSpriteGraphics";
import Size from "../../../engine/Size";

const ANIMATION = "items";
const FRAMESET = "breaking";
const FPS = 10;
const SIZE = new Size(29, 28);

export default class BreakableGraphics extends AnimatedSpriteGraphics {
  constructor(entity) {
    super(entity, ANIMATION, SIZE, FPS);
  }

  pickAnimation() {
    return FRAMESET;
  }
}
