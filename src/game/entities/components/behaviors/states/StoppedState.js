import State from "../../../../engine/State";

export default class StoppedState extends State {
  enter() {
    this.subject.movement.stop();
    return this;
  }

  update() {
    return this;
  }
}
