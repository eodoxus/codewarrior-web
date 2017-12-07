import WalkingState from "./WalkingState";
import StoppedState from "./StoppedState";

export default class StateHelper {
  static faceEntity(mage, entity) {
    const walkingState = new WalkingState(mage);
    mage.setVelocity(mage.getFaceTowardDirection(entity));
    walkingState.updateAnimation(mage);
    new StoppedState(mage);
  }
}
