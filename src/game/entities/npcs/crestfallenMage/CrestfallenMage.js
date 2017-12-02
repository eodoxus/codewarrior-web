import CrestfallenMageSprite from "./CrestfallenMageSprite";
import Entity from "../../../engine/Entity";
import Vector from "../../../engine/Vector";

export default class CrestfallenMage extends Entity {
  static ID = "crestfallenMage";
  static PACING_DISTANCE = 40;
  static STATES = {
    STOPPED: 0,
    WALKING: 1
  };
  static VELOCITY = 10;

  originalPosition;

  constructor(id, position) {
    super(CrestfallenMage.ID, position);
    this.state = CrestfallenMage.STATES.WALKING;
    this.originalPosition = Vector.copy(this.position);
    this.velocity = new Vector(CrestfallenMage.VELOCITY, 0);
  }

  async loadAssets() {
    await this.sprite.loadAssets();
    this.sprite.getAnimation().start();
  }

  stop() {
    super.stop();
    this.state = CrestfallenMage.STATES.STOPPED;
  }

  update(dt) {
    super.update(dt);
    if (this.state === CrestfallenMage.STATES.WALKING) {
      const minX = this.originalPosition.x - CrestfallenMage.PACING_DISTANCE;
      const maxX = this.originalPosition.x + CrestfallenMage.PACING_DISTANCE;
      if (this.position.x <= minX) {
        this.position.x = minX;
        this.velocity.multiply(-1);
      }
      if (this.position.x >= maxX) {
        this.position.x = maxX;
        this.velocity.multiply(-1);
      }

      if (this.velocity.magnitude() > 0) {
        this.sprite.pickAnimation(this.state, this.velocity);
        this.sprite.getAnimation().update(dt);
      }
    }
  }
}
