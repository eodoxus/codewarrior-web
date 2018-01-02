import ReadingState from "./ReadingState";
import State from "../../../engine/State";
import StoppedState from "./StoppedState";
import Vector from "../../../engine/Vector";

const ANIMATIONS = {
  DOWN: "walking_down",
  DOWN_LEFT: "walking_downLeft",
  DOWN_RIGHT: "walking_downRight",
  LEFT: "walking_left",
  RIGHT: "walking_right",
  UP: "walking_up",
  UP_LEFT: "walking_upLeft",
  UP_RIGHT: "walking_upRight"
};
const VELOCITY = 80;

export default class WalkingState extends State {
  static getAnimationFor(hero) {
    const orientation = hero.movement.getOrientation();
    if (orientation.y > 0) {
      if (orientation.x > 0) {
        return ANIMATIONS.DOWN_RIGHT;
      } else if (orientation.x < 0) {
        return ANIMATIONS.DOWN_LEFT;
      }
      return ANIMATIONS.DOWN;
    }

    if (orientation.y === 0) {
      if (orientation.x > 0) {
        return ANIMATIONS.RIGHT;
      } else if (orientation.x < 0) {
        return ANIMATIONS.LEFT;
      }
      return ANIMATIONS.DOWN;
    }

    if (orientation.x > 0) {
      return ANIMATIONS.UP_RIGHT;
    } else if (orientation.x < 0) {
      return ANIMATIONS.UP_LEFT;
    }

    return ANIMATIONS.UP;
  }

  pickAnimation() {
    return WalkingState.getAnimationFor(this.subject);
  }

  update() {
    if (!this.subject.getMovement().isMoving()) {
      this.subject.setVelocity(new Vector(VELOCITY, VELOCITY));
      const hasMoreSteps = this.subject.getMovement().walkToNextStep();
      if (!hasMoreSteps) {
        return this.subject.getBehavior().isReading()
          ? new ReadingState(this.subject)
          : new StoppedState(this.subject);
      }
      return this;
    }
    this.subject.getGraphics().start();
    return this;
  }
}
