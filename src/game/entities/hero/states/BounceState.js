import State from "../../../engine/State";
import Vector from "../../../engine/Vector";
import WalkingState from "./WalkingState";

const ANIMATIONS = {
  DOWN: "bouncing_down",
  LEFT: "bouncing_left",
  RIGHT: "bouncing_right",
  UP: "bouncing_up"
};
const BOUNCE_DISTANCE = 8;

export default class BounceState extends State {
  timer;

  enter(hero) {
    startBounce(hero);
  }

  pickAnimation(hero) {
    let animation = ANIMATIONS.DOWN;
    const orientation = hero.getMovement().getOrientation();
    if (orientation.y < 0) {
      animation = ANIMATIONS.UP;
    } else if (orientation.y === 0) {
      if (orientation.x > 0) {
        animation = ANIMATIONS.RIGHT;
      } else if (orientation.x < 0) {
        animation = ANIMATIONS.LEFT;
      }
    }

    hero
      .getGraphics()
      .getSprite()
      .setAnimation(animation);
    return animation;
  }

  update(hero) {
    if (!hero.getMovement().isMoving()) {
      return endBounce(hero);
    }
    this.pickAnimation(hero);
    return this;
  }
}

function endBounce(hero) {
  const movement = hero.getMovement();
  const orientation = movement.getOrientation();
  movement.setOrientation(Vector.multiply(orientation, -1));
  return new WalkingState(hero);
}

function startBounce(hero) {
  const velocity = Vector.multiply(hero.getVelocity(), -0.5);
  const distance = Vector.multiply(
    hero.getMovement().getOrientation(),
    -1 * BOUNCE_DISTANCE
  );
  const landingPosition = Vector.add(hero.getPosition(), distance);
  hero.setVelocity(velocity);
  hero.getMovement().moveTo(landingPosition);
}
