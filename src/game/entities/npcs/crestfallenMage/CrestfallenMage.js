import AnimatedSpriteGraphics from "../../components/graphics/AnimatedSpriteGraphics";
import CrestfallenMageBehavior from "./CrestfallenMageBehavior";
import Entity from "../../../engine/Entity";
import Size from "../../../engine/Size";

const ANIMATION = "npcs";
const FPS = 10;

export default class CrestfallenMage extends Entity {
  static ID = "crestfallenMage";

  constructor(id, properties) {
    super(CrestfallenMage.ID, properties);
    this.behavior = new CrestfallenMageBehavior(this);
    this.graphics = new AnimatedSpriteGraphics(
      this,
      ANIMATION,
      new Size(24, 32),
      FPS
    );
  }
}
