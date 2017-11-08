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
    UP: "walking_up",
    UP_LEFT: "walking_upLeft",
    UP_RIGHT: "walking_upRight"
  }
};

const STATES = {
  PICKING_UP: 0,
  READING: 1,
  RUNNING: 2,
  WALKING: 3
};

export default class Hero extends Sprite {
  constructor(position) {
    super(position);
    this.config = config;
    this.initFromConfig(config);
    this.state = STATES.WALKING;
    this.velocity = new Vector(0, this.config.walkingVelocity); // Down
    this.updateCurrentAnimation();
  }

  getStateAnimationName() {
    switch (this.state) {
      case STATES.PICKING_UP:
        return ANIMATIONS.PICKING_UP;
      case STATES.READING:
        return ANIMATIONS.READING;
      case STATES.WALKING:
      case STATES.RUNNING:
        return this.getWalkingAnimation();
      default:
        return ANIMATIONS.WALKING.DOWN;
    }
  }

  updateCurrentAnimation() {
    const nextAnimation = this.getStateAnimationName();
    if (!this.curAnimation) {
      this.curAnimation = nextAnimation;
    }

    if (nextAnimation !== this.curAnimation) {
      this.getAnimation()
        .stop()
        .reset();
      this.curAnimation = nextAnimation;
    }
    this.getAnimation().start(this.state === STATES.WALKING ? 2 : 1.5);
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

    if (this.velocity.x > 0) {
      return ANIMATIONS.WALKING.UP_RIGHT;
    } else if (this.velocity.x < 0) {
      return ANIMATIONS.WALKING.UP_LEFT;
    }

    return ANIMATIONS.WALKING.UP;
  }

  getWalkingVelocity() {
    const v = new Vector(1, 1);
    v.multiply(
      this.state === STATES.WALKING
        ? this.config.walkingVelocity
        : this.config.runningVelocity
    );
    return v;
  }

  randomWalk(dt) {
    if (this._dt + dt > 2000) {
      const randX = Math.random();
      const randY = Math.random();
      this.state = randX >= 0.5 ? STATES.RUNNING : STATES.WALKING;
      this.velocity = this.getWalkingVelocity();

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
