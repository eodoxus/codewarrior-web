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
  enter() {
    const movement = this.subject.getMovement();
    const orientation = movement.getOrientation();
    const velocity = Vector.multiply(orientation, VELOCITY);
    const distance = Vector.multiply(orientation, -1 * BOUNCE_DISTANCE);
    const landingPosition = Vector.copy(this.subject.getOrigin()).add(distance);
    const landingTile = this.subject
      .getMap()
      .getClosestWalkableTile(landingPosition);
    this.subject.setVelocity(velocity);
    movement.moveTo(this.subject.translateToOrigin(landingTile.getPosition()));
  }

  exit() {
    this.subject.getGraphics().toggleShadow(false);
    const movement = this.subject.getMovement();
    const orientation = movement.getOrientation();
    movement.setOrientation(Vector.multiply(orientation, -1));
  }

  pickAnimation() {
    let animation = ANIMATIONS.DOWN;
    const orientation = this.subject.getMovement().getOrientation();
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

  update() {
    if (!this.subject.getMovement().isMoving()) {
      return new WalkingState(this.subject);
    }
    this.subject
      .getGraphics()
      .getSprite()
      .setAnimation(this.pickAnimation());
    return this;
  }
}
