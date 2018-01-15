import BehaviorComponent from "../../components/behaviors/BehaviorComponent";
import BehaviorHelper from "../../components/behaviors/BehaviorHelper";
import StoppedState from "../../npcs/behaviors/states/StoppedState";
import WalkingState from "../../npcs/behaviors/states/WalkingState";
import GameEvent from "../../../engine/GameEvent";

const STOPPED_ANIMATION = "down";

export default class EnemyBehavior extends BehaviorComponent {
  constructor(entity) {
    super(entity, WalkingState, StoppedState);
  }

  getStoppedAnimation() {
    return STOPPED_ANIMATION;
  }

  handleEvent(event) {
    if (event.getType() === GameEvent.COLLISION) {
      this.state = new StoppedState(this.entity);
    }
  }

  pickAnimation() {
    return BehaviorHelper.getDirectionAnimation(
      this.entity,
      this.entity.getId() + "_"
    );
  }
}
