import State from "../../../../engine/State";
import Time from "../../../../engine/Time";
import Vector from "../../../../engine/Vector";
import WalkingState from "./WalkingState";

export default class StoppedState extends State {
  stoppedTimer;
  restartTime;

  static enter(mage) {
    mage.setVelocity(new Vector());
    StoppedState.updateAnimation(mage);
    this.stoppedTimer = 0;
    this.restartTime = Math.min((Math.random() * 10 - 5, 1)) * Time.SECOND;
    return StoppedState;
  }

  static handleInput(mage, event) {
    return StoppedState;
  }

  static update(mage, dt) {
    this.stoppedTimer += dt;
    if (this.stoppedTimer > this.restartTime) {
      return WalkingState.enter(mage);
    }
    return StoppedState;
  }

  static updateAnimation(mage) {
    mage
      .getSprite()
      .getAnimation()
      .stop()
      .reset();
  }

  static exit(mage) {
    return StoppedState;
  }
}
