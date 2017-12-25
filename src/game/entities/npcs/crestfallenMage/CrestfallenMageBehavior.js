import BehaviorComponent from "../../components/behaviors/BehaviorComponent";
import GameEvent from "../../../engine/GameEvent";
import StoppedState from "./states/StoppedState";
import TalkingState from "./states/TalkingState";
import WalkingState from "./states/WalkingState";

export default class CrestfallenMageBehavior extends BehaviorComponent {
  listeners;

  constructor(entity) {
    super(entity, WalkingState, StoppedState);
  }

  handleCollision(entity) {
    if (this.entity.isIntent(GameEvent.TALK)) {
      this.entity.getMovement().faceEntity(entity);
      this.fulfillIntent();
      this.state.exit();
      this.state = new TalkingState(this.entity, entity);
    } else {
      this.state.exit();
      this.state = new StoppedState(this.entity);
    }
  }

  handleEvent(event) {
    if (event.getType() === GameEvent.COLLISION) {
      const entity = event.getData();
      this.handleCollision(entity);
    }
  }
}
