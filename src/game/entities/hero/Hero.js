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
    this.initFromConfig(config);
    this.state = STATES.WALKING;
    this.direction = new Vector(0, -1); // Down
  }

  load() {
    super.load();
    this.updateCurrentAnimation();
    this.velocity = 100;
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
    if (this.direction.y < 0) {
      if (this.direction.x > 0) {
        return ANIMATIONS.WALKING.DOWN_RIGHT;
      } else if (this.direction.x < 0) {
        return ANIMATIONS.WALKING.DOWN_LEFT;
      }
      return ANIMATIONS.WALKING.DOWN;
    }

    if (this.direction.y === 0) {
      if (this.direction.x > 0) {
        return ANIMATIONS.WALKING.RIGHT;
      }
      return ANIMATIONS.WALKING.LEFT;
    }

    return ANIMATIONS.WALKING.UP;
  }

  randomWalk(dt) {
    if (this._dt + dt > 2000) {
      const randX = Math.random();
      const randY = Math.random();
      if (randX < 0.3) {
        this.direction.x = -1;
      } else if (randX < 0.6) {
        this.direction.x = 0;
      } else {
        this.direction.x = 1;
      }
      if (randY < 0.3) {
        this.direction.y = -1;
      } else if (randY < 0.6) {
        this.direction.y = 0;
      } else {
        this.direction.y = 1;
        this.direction.x = 0;
      }
      this._dt = 0;
    }
  }

  update(dt) {
    this.randomWalk(dt);
    this.updateCurrentAnimation();
    super.update(dt);
  }
}
