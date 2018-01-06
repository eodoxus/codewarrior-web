import GameEvent from "../../../../engine/GameEvent";
import State from "../../../../engine/State";
import StoppedState from "./StoppedState";
import Time from "../../../../engine/Time";

const DIALOG_TIMEOUT = 2;

export default class TalkingState extends State {
  entity;
  timer;

  enter(entity) {
    this.subject.stop();
    this.entity = entity;
    this.timer = Time.timer();
    this.updateDialog();
    GameEvent.fire(
      GameEvent.DIALOG,
      this.subject.behavior.getDialog().getMessage()
    );
    return this;
  }

  update() {
    if (this.subject.intersects(this.entity)) {
      return this;
    }

    if (this.timer.elapsed() > Time.SECOND * DIALOG_TIMEOUT) {
      return new StoppedState(this.subject);
    }
    return this;
  }

  updateDialog() {
    this.subject.behavior.getDialog().next();
  }
}
