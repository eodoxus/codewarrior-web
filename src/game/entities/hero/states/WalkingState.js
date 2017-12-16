import State from "../../../engine/State";
import StateHelper from "./StateHelper";
import StoppedState from "./StoppedState";
import Vector from "../../../engine/Vector";

const VELOCITY = 80;

export default class WalkingState extends State {
  handleEvent(hero, event) {
    return StateHelper.handleEvent(this, hero, event);
  }

  update(hero) {
    const didMoveEnd = !hero.movement.getCurrentMove();
    if (didMoveEnd) {
      hero.setVelocity(new Vector(VELOCITY, VELOCITY));
      const hasMoreSteps = hero.movement.walkToNextStep();
      if (!hasMoreSteps) {
        return new StoppedState(hero);
      }
      return this;
    }
    hero.graphics.start();
    return this;
  }
}
