import State from "../../../engine/State";
import WalkingState from "./WalkingState";

export default class StoppedState extends State {
  enter(hero) {
    hero.getMovement().stop();
    hero.getGraphics().stop();
    return this;
  }

  pickAnimation(hero) {
    return WalkingState.animationForOrientation(hero);
  }
}
