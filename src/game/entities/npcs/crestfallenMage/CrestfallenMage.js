import CrestfallenMageSprite from "./CrestfallenMageSprite";
import Entity from "../../../engine/Entity";
import Vector from "../../../engine/Vector";
import Time from "../../../engine/Time";

export default class CrestfallenMage extends Entity {
  static ID = "crestfallenMage";
  static PACING_DISTANCE = 40;
  static STATES = {
    STOPPED: 0,
    WALKING: 1
  };
  static VELOCITY = 10;

  originalPosition;
  stoppedTimer;
  restartTime;

  constructor(id, position) {
    super(CrestfallenMage.ID, position);
    this.state = CrestfallenMage.STATES.WALKING;
    this.originalPosition = Vector.copy(this.position);
    this.sprite = new CrestfallenMageSprite();
    this.velocity = new Vector(CrestfallenMage.VELOCITY, 0);
    this.stoppedTimer = 0;
  }

  async loadAssets() {
    await this.sprite.loadAssets();
    this.sprite.getAnimation().start();
  }

  start() {
    this.state = CrestfallenMage.STATES.WALKING;
    const direction = Math.random() > 0.5 ? 1 : -1;
    this.velocity = new Vector(CrestfallenMage.VELOCITY * direction, 0);
  }

  stop() {
    super.stop();
    this.state = CrestfallenMage.STATES.STOPPED;
    this.sprite.pickAnimation();
    this.stoppedTimer = 0;
    this.restartTime = Math.min((Math.random() * 10 - 5, 1)) * Time.SECOND;
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
    } else {
      this.stoppedTimer += dt;
      if (this.stoppedTimer > this.restartTime) {
        this.start();
      }
    }
  }
}
