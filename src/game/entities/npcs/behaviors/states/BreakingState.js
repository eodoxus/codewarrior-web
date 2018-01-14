import State from "../../../../engine/State";
import Time from "../../../../engine/Time";
import StoppedState from "./StoppedState";

const ANIMATION_DURATION = 500;

export default class BreakingState extends State {
  timer;

  enter() {
    this.timer = Time.timer();
    this.restartTime = (Math.floor(Math.random() * 5) + 1) * Time.SECOND;
    this.subject.setGraphics(this.subject.getBreakingGraphics());
    this.subject
      .getGraphics()
      .getSprite()
      .changeAnimationTo(this.pickAnimation());
    return this;
  }

  pickAnimation() {
    return this.subject.getGraphics().pickAnimation();
  }

  update() {
    if (this.timer.elapsed() > ANIMATION_DURATION) {
      this.subject.kill();
      return new StoppedState(this.subject);
    }
    this.subject.getGraphics().start();
    return this;
  }
}
