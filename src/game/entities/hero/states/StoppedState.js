import State from "../../../engine/State";

export default class StoppedState extends State {
  enter(hero) {
    hero.getMovement().stop();
    hero.getGraphics().stop();
    return this;
  }
}
