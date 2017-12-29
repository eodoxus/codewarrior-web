import State from "../../../engine/State";
import Vector from "../../../engine/Vector";
import WalkingState from "./WalkingState";

const ANIMATIONS = {
  DOWN: "jumping_down",
  LEFT: "jumping_left",
  RIGHT: "jumping_right",
  UP: "jumping_up"
};
const VELOCITY = 160;

export default class JumpingState extends State {
  enter(hero) {
    hero.setVelocity(new Vector(VELOCITY, VELOCITY));
    hero.getPosition().subtract(new Vector(0, 4));
  }

  pickAnimation(hero) {
    const orientation = hero.movement.getOrientation();
    if (orientation.y > 0) {
      return ANIMATIONS.DOWN;
    }

    if (orientation.y === 0) {
      if (orientation.x > 0) {
        return ANIMATIONS.RIGHT;
      } else if (orientation.x < 0) {
        return ANIMATIONS.LEFT;
      }
      return ANIMATIONS.DOWN;
    }

    return ANIMATIONS.UP;
  }

  update(hero) {
    const didMoveEnd = !hero.getMovement().getCurrentMove();
    if (didMoveEnd) {
      hero.getPosition().add(new Vector(0, 4));
      return new WalkingState(hero);
    }
    hero
      .getGraphics()
      .getSprite()
      .setAnimation(this.pickAnimation(hero));
    return this;
  }
}
