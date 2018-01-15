import BehaviorComponent from "../../components/behaviors/BehaviorComponent";
import GameEvent from "../../../engine/GameEvent";
import StoppedState from "./states/StoppedState";
import TalkingState from "./states/TalkingState";
import WalkingState from "./states/WalkingState";
import BehaviorHelper from "../../components/behaviors/BehaviorHelper";

const STOPPED_ANIMATION = "down";

export default class NpcBehavior extends BehaviorComponent {
  listeners;
  talkingState;

  constructor(entity) {
    super(entity, WalkingState, StoppedState);
    this.talkingState = TalkingState;
  }

  getStoppedAnimation() {
    return STOPPED_ANIMATION;
  }

  handleCollision(entity) {
    if (this.entity.isIntent(GameEvent.TALK)) {
      this.entity.getMovement().faceEntity(entity);
      this.fulfillIntent();
      this.state = new this.talkingState(this.entity, entity);
    } else {
      this.state = new StoppedState(this.entity);
    }
  }

  handleEvent(event) {
    if (event.getType() === GameEvent.COLLISION) {
      const entity = event.getData();
      this.handleCollision(entity);
    }
  }

  pickAnimation() {
    return BehaviorHelper.getDirectionAnimation(
      this.entity,
      this.entity.getId() + "_"
    );
  }
}
