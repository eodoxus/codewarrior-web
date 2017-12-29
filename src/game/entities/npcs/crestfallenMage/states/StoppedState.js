import State from "../../../../engine/State";
import Time from "../../../../engine/Time";
import WalkingState from "./WalkingState";

export default class StoppedState extends State {
  timer;
  restartTime;

  enter(mage) {
    mage.movement.stop();
    this.timer = Time.timer();
    this.restartTime = (Math.floor(Math.random() * 5) + 1) * Time.SECOND;
    return this;
  }

  update(mage) {
    if (this.timer.elapsed() > this.restartTime) {
      return new WalkingState(mage);
    }
    return this;
  }
}
