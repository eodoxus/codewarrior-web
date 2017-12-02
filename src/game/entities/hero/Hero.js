import WalkingEntity from "../../engine/WalkingEntity";
import HeroSprite from "./HeroSprite";
import Vector from "../../engine/Vector";

export default class Hero extends WalkingEntity {
  static ID = "hero";

  static STATES = {
    STOPPED: 0,
    PICKING_UP: 1,
    READING: 2,
    RUNNING: 3,
    WALKING: 4
  };

  static VELOCITY = {
    RUNNING: 140,
    WALKING: 70
  };

  constructor() {
    super(Hero.ID);
    this.sprite = new HeroSprite();
    this.state = Hero.STATES.STOPPED;
  }

  getStateVelocity() {
    let v = 0;
    switch (this.state) {
      case Hero.STATES.WALKING:
        v = Hero.VELOCITY.WALKING;
        break;
      case Hero.STATES.RUNNING:
        v = Hero.VELOCITY.RUNNING;
        break;
      default:
    }
    return new Vector(1, 1).multiply(v);
  }

  setPosition(position) {
    super.setPosition(this.translateToOrigin(position));
  }

  stop() {
    super.stop();
    this.state = Hero.STATES.STOPPED;
    this.sprite.getAnimation().reset();
  }

  update(dt) {
    super.update(dt);

    if (
      this.state === Hero.STATES.WALKING ||
      this.state === Hero.STATES.RUNNING
    ) {
      const speed = this.velocity.magnitude();
      if (speed > 0) {
        this.sprite.pickAnimation(this.state, this.velocity);
      }

      const animation = this.sprite.getAnimation();
      if (speed > 0) {
        animation.update(dt);
      }

      if (!this.getCurrentMove() && !this.walkToNextStep()) {
        this.state = Hero.STATES.STOPPED;
        animation.reset();
      }
    }
  }

  walkTo(tile) {
    this.state = Hero.STATES.WALKING;
    super.walkTo(tile);
  }
}
