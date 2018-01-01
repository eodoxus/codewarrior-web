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
const VELOCITY = 40;

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
    return animation;
  }

  update(hero) {
    if (!hero.getMovement().isMoving()) {
      return endBounce(hero);
    }
    hero
      .getGraphics()
      .getSprite()
      .setAnimation(this.pickAnimation(hero));
    return this;
  }
}

function endBounce(hero) {
  hero.getGraphics().toggleShadow(false);
  const movement = hero.getMovement();
  const orientation = movement.getOrientation();
  movement.setOrientation(Vector.multiply(orientation, -1));
  return new WalkingState(hero);
}

function startBounce(hero) {
  const velocity = Vector.multiply(
    hero.getMovement().getOrientation(),
    VELOCITY
  );
  const distance = Vector.multiply(
    hero.getMovement().getOrientation(),
    -1 * BOUNCE_DISTANCE
  );
  const landingPosition = Vector.copy(hero.getOrigin()).add(distance);
  const landingTile = hero.getMap().getClosestWalkableTile(landingPosition);
  hero.setVelocity(velocity);
  hero.getMovement().moveTo(hero.translateToOrigin(landingTile.getPosition()));
}
