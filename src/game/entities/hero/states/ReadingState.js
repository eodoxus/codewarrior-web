import GameEvent from "../../../engine/GameEvent";
import State from "../../../engine/State";
import Vector from "../../../engine/Vector";
import WalkingState from "./WalkingState";

const ANIMATION = "reading";

GameEvent.on(
  GameEvent.CLOSE_TATTERED_PAGE,
  () => (ReadingState.isReading = false)
);

export default class ReadingState extends State {
  static isReading;

  enter(hero) {
    ReadingState.isReading = true;
    hero.setVelocity(new Vector());
  }

  pickAnimation(hero) {
    hero
      .getGraphics()
      .getSprite()
      .setAnimation(ANIMATION);
    return this;
  }

  update(hero) {
    if (!ReadingState.isReading) {
      hero.getMovement().setOrientation(new Vector(0, -1));
      return new WalkingState(hero);
    }
    return this.pickAnimation(hero);
  }
}
