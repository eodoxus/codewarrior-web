import Sprite from "../../engine/Sprite";
import Vector from "../../engine/Vector";
import config from "./config";

const ANIMATIONS = {
  PICKING_UP: "pickingUp",
  READING: "reading",
  WALKING: {
    DOWN: "walking_down",
    DOWN_LEFT: "walking_downLeft",
    DOWN_RIGHT: "walking_downRight",
    LEFT: "walking_left",
    RIGHT: "walking_right",
    UP: "walking_up"
  }
};

const STATES = {
  PICKING_UP: 0,
  READING: 1,
  WALKING: 2
};

export default class Hero extends Sprite {
  constructor(position) {
    super(position);
    this.config = config;
    this.initFromConfig(config);
    this.state = STATES.WALKING;
    this.velocity = new Vector(0, this.config.walkingVelocity); // Down
    this.updateCurrentAnimation();
    this.getAnimation().start();
  }

  updateCurrentAnimation() {
    switch (this.state) {
      case STATES.PICKING_UP:
        return (this.curAnimation = ANIMATIONS.PICKING_UP);
      case STATES.READING:
        return (this.curAnimation = ANIMATIONS.READING);
      case STATES.WALKING:
        return (this.curAnimation = this.getWalkingAnimation());
      default:
        return (this.curAnimation = ANIMATIONS.WALKING.DOWN);
    }
  }

  getWalkingAnimation() {
    if (this.velocity.y > 0) {
      if (this.velocity.x > 0) {
        return ANIMATIONS.WALKING.DOWN_RIGHT;
      } else if (this.velocity.x < 0) {
        return ANIMATIONS.WALKING.DOWN_LEFT;
      }
      return ANIMATIONS.WALKING.DOWN;
    }

    if (this.velocity.y === 0) {
      if (this.velocity.x > 0) {
        return ANIMATIONS.WALKING.RIGHT;
      } else if (this.velocity.x < 0) {
        return ANIMATIONS.WALKING.LEFT;
      }
      return ANIMATIONS.WALKING.DOWN;
    }

    return ANIMATIONS.WALKING.UP;
  }

  randomWalk(dt) {
    if (this._dt + dt > 2000) {
      this.velocity = new Vector(
        this.config.walkingVelocity,
        this.config.walkingVelocity
      );

      const randX = Math.random();
      const randY = Math.random();
      if (randX < 0.3) {
        this.velocity.x *= -1;
      } else if (randX < 0.6) {
        this.velocity.x = 0;
      }
      if (randY < 0.3) {
        this.velocity.y *= -1;
      } else if (randY < 0.6) {
        this.velocity.y = 0;
      }
      this._dt = 0;
    }
  }

  update(dt) {
    this.randomWalk(dt);
    if (this.velocity.magnitude() !== 0) {
      this.updateCurrentAnimation();
    }
    super.update(dt);
  }
}
