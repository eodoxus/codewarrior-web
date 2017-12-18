import State from "../../../../engine/State";

export default class WalkingState extends State {
  enter(mage) {
    mage.getMovement().start();
    return this;
  }
}
