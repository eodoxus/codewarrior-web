import State from "../../../engine/State";
import Vector from "../../../engine/Vector";
import WalkingState from "./WalkingState";

const ANIMATIONS = {
  DOWN: "jumping_down",
  LEFT: "jumping_left",
  RIGHT: "jumping_right",
  UP: "jumping_up"
};
const JUMP_HEIGHT = 8;
const VELOCITY = 160;

export default class JumpingState extends State {
  enter(hero, tile) {
    hero.setVelocity(new Vector(VELOCITY, VELOCITY));
    hero.getMovement().moveTo(tileLandingPosition(hero, tile));
    startJump(hero);
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
    return this;
  }

  update(hero) {
    if (!hero.getMovement().isMoving()) {
      return endJump(hero);
    }
    return this.pickAnimation(hero);
  }
}

function endJump(hero) {
  hero.getPosition().add(new Vector(0, JUMP_HEIGHT));
  return new WalkingState(hero);
}

function startJump(hero) {
  hero.getPosition().subtract(new Vector(0, JUMP_HEIGHT));
}

function tileLandingPosition(hero, tile) {
  const position = hero.translateToOrigin(tile);
  position.add(new Vector(4, -12));
  return position;
}
