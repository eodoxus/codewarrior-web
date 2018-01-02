import State from "../../../engine/State";
import WalkingState from "./WalkingState";

export default class StoppedState extends State {
  enter() {
    this.subject.getMovement().stop();
    this.subject.getGraphics().stop();
    return this;
  }

  pickAnimation() {
    return WalkingState.getAnimationFor(this.subject);
  }
}
