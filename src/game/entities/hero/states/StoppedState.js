import State from "../../../engine/State";
import StateHelper from "./StateHelper";

export default class StoppedState extends State {
  enter(hero) {
    hero.movement.stop();
    hero.graphics.stop();
    return this;
  }

  handleEvent(hero, event) {
    return StateHelper.handleEvent(this, hero, event);
  }
}
