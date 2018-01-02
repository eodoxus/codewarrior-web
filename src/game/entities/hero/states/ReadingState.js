import GameEvent from "../../../engine/GameEvent";
import State from "../../../engine/State";
import Vector from "../../../engine/Vector";
import WalkingState from "./WalkingState";

let isReading = false;
const ANIMATION = "reading";

GameEvent.on(GameEvent.CLOSE_TATTERED_PAGE, () => (isReading = false));

export default class ReadingState extends State {
  enter() {
    isReading = true;
    this.subject.setOrientation(new Vector(0, -1));
    this.subject.setVelocity(new Vector());
  }

  pickAnimation() {
    return ANIMATION;
  }

  update() {
    if (!isReading) {
      return new WalkingState(this.subject);
    }
    this.subject
      .getGraphics()
      .getSprite()
      .setAnimation(this.pickAnimation());
    return this;
  }
}
