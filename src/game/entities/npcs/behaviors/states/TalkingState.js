import actions from "../../../actions";
import GameEvent from "../../../../engine/GameEvent";
import State from "../../../../engine/State";
import StoppedState from "./StoppedState";
import Time from "../../../../engine/Time";

const DIALOG_TIMEOUT = Time.SECOND * 2;

export default class TalkingState extends State {
  action;
  dialog;
  dialogListener;
  entity;
  timer;

  enter(entity) {
    this.subject.stop();
    this.entity = entity;
    this.dialog = this.subject.behavior.getDialog();
    if (!this.dialog.hasConfirm()) {
      this.dialog.next();
    }
    this.speak();
    this.timer = Time.timer();
    this.dialogListener = GameEvent.on(
      GameEvent.CONFIRM,
      event => this.onDialogConfirm(),
      true
    );
    return this;
  }

  exit() {
    if (this.action) {
      this.action.finish();
    }
    if (this.dialogListener) {
      this.dialogListener.remove();
      delete this.dialogListener;
    }
  }

  onDialogConfirm = () => {
    const action = this.dialog.getAction();
    if (action) {
      this.action = actions.create(this.subject, action);
      this.action.execute();
    } else {
      this.dialog.next();
      this.speak();
    }
  };

  speak() {
    GameEvent.fireAfterClick(
      GameEvent.DIALOG,
      this.subject.behavior.getDialog().getMessage()
    );
  }

  update() {
    if (this.subject.intersects(this.entity)) {
      return this;
    }

    if (this.timer.elapsed() > DIALOG_TIMEOUT) {
      return new StoppedState(this.subject);
    }
    return this;
  }
}
