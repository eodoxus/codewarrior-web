import GameEvent from "../../../../engine/GameEvent";
import State from "../../../../engine/State";
import TalkingState from "./TalkingState";
import Time from "../../../../engine/Time";
import Vector from "../../../../engine/Vector";
import WalkingState from "./WalkingState";

export default class StoppedState extends State {
  stoppedTimer;
  restartTime;

  static enter(mage) {
    mage.setVelocity(new Vector());
    StoppedState.updateAnimation(mage);
    this.stoppedTimer = 0;
    this.restartTime = Math.min((Math.random() * 10 - 5, 1)) * Time.SECOND;
    return StoppedState;
  }

  static handleInput(mage, event) {
    if (event.getType() === GameEvent.COLLISION) {
      const entity = event.getData();
      if (entity.isHero() && entity.isIntent(GameEvent.TALK)) {
        entity.fulfillIntent();
        return TalkingState.enter(mage, entity);
      }
      StoppedState.enter(mage);
    }
    return StoppedState;
  }

  static update(mage, dt) {
    this.stoppedTimer += dt;
    if (this.stoppedTimer > this.restartTime) {
      return WalkingState.enter(mage);
    }
    StoppedState.updateAnimation(mage);
    return StoppedState;
  }

  static updateAnimation(mage) {
    mage
      .getSprite()
      .getAnimation()
      .stop()
      .reset();
  }

  static exit(mage) {
    return StoppedState;
  }
}
