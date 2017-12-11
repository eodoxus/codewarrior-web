import AnimationGraphics from "../../components/graphics/AnimationGraphics";
import AnimateSometimesBehavior from "../../components/behaviors/AnimateSometimesBehavior";
import Entity from "../../../engine/Entity";
import Size from "../../../engine/Size";
import StaticMovement from "../../components/movements/StaticMovement";
import Vector from "../../../engine/Vector";

const ANIMATION = "underworld";
const FPS = 20;

export default class FirePit extends Entity {
  static ID = "firePit";

  constructor(id, position) {
    super(FirePit.ID, position);
    this.movement = new StaticMovement(this, new Vector(), position);
    this.behavior = new AnimateSometimesBehavior(this);
    this.graphics = new AnimationGraphics(
      this,
      ANIMATION,
      FirePit.ID,
      new Size(16, 16),
      FPS
    );
  }
}
