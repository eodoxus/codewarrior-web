import GameEvent from "../../../../engine/GameEvent";
import State from "../../../../engine/State";
import StoppedState from "./StoppedState";
import TalkingState from "./TalkingState";

export default class WalkingState extends State {
  enter(mage) {
    mage.movement.start();
    return this;
  }

  handleEvent(mage, event) {
    if (event.getType() === GameEvent.COLLISION) {
      const entity = event.getData();
      if (entity.isIntent(GameEvent.TALK)) {
        return new TalkingState(mage, entity);
      }
      return new StoppedState(mage);
    }
    return this;
  }
}
