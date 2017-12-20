import GameEvent from "../../../../engine/GameEvent";
import GameState from "../../../../GameState";
import State from "../../../../engine/State";
import StoppedState from "./StoppedState";
import Time from "../../../../engine/Time";

const DIALOG_TIMEOUT = 2;

export default class TalkingState extends State {
  entity;
  timer;
  dialogListener;

  enter(mage, entity) {
    mage.stop();
    this.entity = entity;
    this.timer = GameState.timer();
    mage.movement.faceEntity(entity);
    this.updateMageDialog(mage);
    GameEvent.fire(GameEvent.DIALOG, mage.behavior.getDialog().getMessage());
    return this;
  }

  onDialogConfirm(dialog) {
    this.dialogListener.remove();
    delete this.dialogListener;
    GameEvent.fire(GameEvent.NPC_INTERACTION, { interaction: dialog.action });
  }

  startDialogListener() {
    if (!this.dialogListener) {
      this.dialogListener = GameEvent.on(
        GameEvent.CONFIRM,
        event => this.onDialogConfirm(event.dialog),
        true
      );
    }
  }

  update(mage) {
    if (mage.intersects(this.entity)) {
      return this;
    }

    if (this.timer.elapsed() > Time.SECOND * DIALOG_TIMEOUT) {
      return new StoppedState(mage);
    }
    return this;
  }

  updateMageDialog(mage) {
    const dialog = mage.behavior.getDialog();
    const caveSceneState = GameState.getSceneState("HomeCaveScene");
    switch (dialog.getState()) {
      case 0:
        const hasEnteredCave = !!caveSceneState;
        if (hasEnteredCave) {
          dialog.setState(1);
        }
        break;
      case 1:
        dialog.setState(2);
        this.startDialogListener();
        break;
      case 2:
        this.startDialogListener();
        break;
      case 3:
        break;
      default:
        dialog.setState(0);
    }
  }
}
