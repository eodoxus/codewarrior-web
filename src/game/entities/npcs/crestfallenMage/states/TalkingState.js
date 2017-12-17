import GameEvent from "../../../../engine/GameEvent";
import GameState from "../../../../GameState";
import State from "../../../../engine/State";
import StoppedState from "./StoppedState";
import Time from "../../../../engine/Time";

const DIALOG_TIMEOUT = 2;

export default class TalkingState extends State {
  entity;
  timer;

  enter(mage, entity) {
    mage.stop();
    this.entity = entity;
    this.timer = GameState.timer();
    mage.movement.faceEntity(entity);
    const dialog = mage.behavior.getDialog();
    this.updateMageDialog(mage);
    GameEvent.fire(GameEvent.DIALOG, dialog.getText());
    return this;
  }

  handleEvent(mage, event) {
    if (event.getType() === GameEvent.COLLISION) {
      const entity = event.getData();
      if (entity.behavior.isIntent(GameEvent.TALK)) {
        return this.enter(mage, entity);
      }
    }
    return this;
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
          dialog.next();
        }
        break;
      case 1:
        dialog.next();
        break;
      case 2:
        break;
      case 3:
        break;
      default:
        dialog.next();
    }
  }
}
