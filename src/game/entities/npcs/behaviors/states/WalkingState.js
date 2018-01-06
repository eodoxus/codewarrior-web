import State from "../../../../engine/State";

export default class WalkingState extends State {
  enter() {
    this.subject.getMovement().start();
    return this;
  }
}
