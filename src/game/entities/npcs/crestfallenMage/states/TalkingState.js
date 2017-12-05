import GameEvent from "../../../../engine/GameEvent";
import State from "../../../../engine/State";
import Time from "../../../../engine/Time";
import StoppedState from "./StoppedState";

const DIALOG_TIMEOUT = 2;

export default class TalkingState extends State {
  entity;
  startTimer;

  static enter(mage, entity) {
    TalkingState.entity = entity;
    StoppedState.enter(mage);
    this.startTimer = 0;
    GameEvent.fire(GameEvent.DIALOG, mage.getDialog().getText());
    mage.getDialog().next();
    return TalkingState;
  }

  static handleInput(mage, event) {
    if (event.getType() === GameEvent.COLLISION) {
      const entity = event.getData();
      if (entity.isHero() && entity.isIntent(GameEvent.TALK)) {
        entity.fulfillIntent();
        return TalkingState.enter(mage, entity);
      }
    }
    return TalkingState;
  }

  static update(mage, dt) {
    if (mage.intersects(TalkingState.entity)) {
      return TalkingState;
    }

    this.startTimer += dt;
    if (this.startTimer > Time.SECOND * DIALOG_TIMEOUT) {
      return StoppedState.enter(mage);
    }
    return TalkingState;
  }

  static exit(mage) {
    return TalkingState;
  }
}
