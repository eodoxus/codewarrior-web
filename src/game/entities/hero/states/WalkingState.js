import State from "../../../engine/State";
import StoppedState from "./StoppedState";
import Vector from "../../../engine/Vector";

const VELOCITY = 80;

export default class WalkingState extends State {
  update(hero) {
    const didMoveEnd = !hero.getMovement().getCurrentMove();
    if (didMoveEnd) {
      hero.setVelocity(new Vector(VELOCITY, VELOCITY));
      const hasMoreSteps = hero.getMovement().walkToNextStep();
      if (!hasMoreSteps) {
        return new StoppedState(hero);
      }
      return this;
    }
    hero.getGraphics().start();
    return this;
  }
}
