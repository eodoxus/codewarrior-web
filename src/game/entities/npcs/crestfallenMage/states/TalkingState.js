import GameEvent from "../../../../engine/GameEvent";
import State from "../../../../engine/State";
import StateHelper from "./StateHelper";
import StoppedState from "./StoppedState";
import Time from "../../../../engine/Time";

const DIALOG_TIMEOUT = 2;

export default class TalkingState extends State {
  entity;
  startTimer;

  enter(mage, entity) {
    this.entity = entity;
    new StoppedState(mage);
    this.startTimer = 0;
    GameEvent.fire(GameEvent.DIALOG, mage.getDialog().getText());
    mage.getDialog().next();
    return this;
  }

  handleInput(mage, event) {
    if (event.getType() === GameEvent.COLLISION) {
      const entity = event.getData();
      if (StateHelper.wasIntentFulfilled(entity)) {
        return this.enter(mage, entity);
      }
    }
    return this;
  }

  update(mage, dt) {
    if (mage.intersects(this.entity)) {
      return this;
    }

    this.startTimer += dt;
    if (this.startTimer > Time.SECOND * DIALOG_TIMEOUT) {
      return new StoppedState(mage);
    }
    return this;
  }
}
