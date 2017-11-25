import AnimationCollection from "../../engine/AnimationCollection";
import Entity from "../../engine/Entity";
import HeroSprite from "./HeroSprite";
import Size from "../../engine/Size";
import Vector from "../../engine/Vector";
import config from "./config";

export default class Hero extends Entity {
  static STATES = {
    STOPPED: 0,
    PICKING_UP: 1,
    READING: 2,
    RUNNING: 3,
    WALKING: 4
  };

  config;
  id = "hero";
  pathFinder;
  sprite;
  state;

  constructor() {
    super();
    this.sprite = new HeroSprite(
      new Size(
        config.width || this.size.width,
        config.height || this.size.height
      ),
      new AnimationCollection(config.animations || {})
    );
    this.state = Hero.STATES.STOPPED;
    this.sprite.updateCurrentAnimation(this.state, this.velocity);
  }

  getStateVelocity() {
    let v = 0;
    switch (this.state) {
      case Hero.STATES.WALKING:
        v = config.walkingVelocity;
        break;
      case Hero.STATES.RUNNING:
        v = config.runningVelocity;
        break;
      default:
    }
    return new Vector(1, 1).multiply(v);
  }

  setPosition(position) {
    super.setPosition(this.translateToOrigin(position));
  }

  update(dt) {
    super.update(dt);

    if (this.velocity.magnitude() !== 0) {
      this.sprite.updateCurrentAnimation(this.state, this.velocity);
    }

    const animation = this.sprite.getAnimation();
    if (this.velocity.magnitude() > 0) {
      animation.update(dt);
    }

    if (
      this.state === Hero.STATES.WALKING ||
      this.state === Hero.STATES.RUNNING
    ) {
      if (!this.getCurrentMove()) {
        this.walkToNextStep();

        if (this.velocity.magnitude() === 0) {
          this.state = Hero.STATES.STOPPED;
          animation.reset();
        }
      }
    }
  }

  walkTo(tile) {
    this.state = Hero.STATES.WALKING;
    super.walkTo(tile);
  }
}
