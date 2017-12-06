import AnimatedSprite from "../../../engine/AnimatedSprite";
import Actor from "../../../engine/Actor";
import GameEvent from "../../../engine/GameEvent";
import Size from "../../../engine/Size";
import Vector from "../../../engine/Vector";
import WalkingState from "./states/WalkingState";

export default class CrestfallenMage extends Actor {
  static FPS = 10;
  static ID = "crestfallenMage";

  originalPosition;

  constructor(id, position) {
    super(CrestfallenMage.ID, position);
    this.originalPosition = Vector.copy(this.position);
    this.sprite = new AnimatedSprite(
      "npcs",
      new Size(20, 24),
      CrestfallenMage.FPS
    );
    this.state = new WalkingState(this);
  }

  getOriginalPosition() {
    return this.originalPosition;
  }

  handleCollision(entity) {
    this.state = this.state.handleInput(this, GameEvent.collision(entity));
  }

  update(dt) {
    super.update(dt);
    this.state = this.state.update(this, dt);
    this.sprite.getAnimation().update(dt);
  }
}
