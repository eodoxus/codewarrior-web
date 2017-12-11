import GameEvent from "../../../../engine/GameEvent";
import State from "../../../../engine/State";
import TalkingState from "./TalkingState";
import Time from "../../../../engine/Time";
import WalkingState from "./WalkingState";

export default class StoppedState extends State {
  stoppedTimer;
  restartTime;

  enter(mage) {
    mage.movement.stop();
    this.stoppedTimer = 0;
    this.restartTime = Math.min((Math.random() * 10 - 5, 1)) * Time.SECOND;
    return this;
  }

  handleEvent(mage, event) {
    if (event.getType() === GameEvent.COLLISION) {
      const entity = event.getData();
      if (entity.isIntent(GameEvent.TALK)) {
        return new TalkingState(mage, entity);
      }
    }
    return this.enter(mage);
  }

  update(mage, dt) {
    this.stoppedTimer += dt;
    if (this.stoppedTimer > this.restartTime) {
      return new WalkingState(mage);
    }
    return this;
  }
}
