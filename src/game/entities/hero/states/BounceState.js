import BehaviorHelper from "../../components/behaviors/BehaviorHelper";
import HeroBehaviorHelper from "../HeroBehaviorHelper";
import State from "../../../engine/State";
import Vector from "../../../engine/Vector";

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
    return BehaviorHelper.getDirectionAnimation(this.subject, "bouncing_");
  }

  update() {
    if (!this.subject.getMovement().isMoving()) {
      return HeroBehaviorHelper.land(this.subject);
    }
    this.subject
      .getGraphics()
      .getSprite()
      .setAnimation(this.pickAnimation());
    return this;
  }
}
