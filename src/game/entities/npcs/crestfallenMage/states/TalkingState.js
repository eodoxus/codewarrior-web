import GameEvent from "../../../../engine/GameEvent";
import State from "../../../../engine/State";
import StoppedState from "./StoppedState";
import Time from "../../../../engine/Time";

const DIALOG_TIMEOUT = 2;

export default class TalkingState extends State {
  entity;
  startTimer;

  enter(mage, entity) {
    mage.stop();
    this.entity = entity;
    this.startTimer = 0;
    mage.movement.faceEntity(entity);
    GameEvent.fire(GameEvent.DIALOG, mage.behavior.getDialog().getText());
    mage.behavior.getDialog().next();
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
