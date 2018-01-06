import BehaviorComponent from "../../components/behaviors/BehaviorComponent";
import GameEvent from "../../../engine/GameEvent";
import StoppedState from "./states/StoppedState";
import TalkingState from "./states/TalkingState";
import WalkingState from "./states/WalkingState";

const ANIMATIONS = {
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
  UP: "up"
};
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
    const orientation = this.entity.movement.getOrientation();
    let animationName = ANIMATIONS.DOWN;
    if (orientation.y < 0) {
      animationName = ANIMATIONS.UP;
    }
    if (orientation.y === 0) {
      if (orientation.x > 0) {
        animationName = ANIMATIONS.RIGHT;
      } else if (orientation.x < 0) {
        animationName = ANIMATIONS.LEFT;
      }
    }
    return this.entity.getId() + "_" + animationName;
  }
}
