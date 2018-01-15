import Audio from "../../../engine/Audio";
import BehaviorHelper from "../../components/behaviors/BehaviorHelper";
import BounceState from "./BounceState";
import HeroBehaviorHelper from "../HeroBehaviorHelper";
import State from "../../../engine/State";
import Vector from "../../../engine/Vector";

const JUMP_HEIGHT = 8;
const VELOCITY = 80;

export default class JumpingState extends State {
  enter(tile) {
    Audio.play(Audio.EFFECTS.JUMP);
    this.subject.getGraphics().toggleShadow();
    this.subject.setVelocity(new Vector(VELOCITY, VELOCITY));
    this.subject.getMovement().moveTo(tileLandingPosition(this.subject, tile));
    this.subject.getPosition().subtract(new Vector(0, JUMP_HEIGHT));
  }

  exit() {
    this.subject.getGraphics().toggleShadow(false);
    this.subject.getPosition().add(new Vector(0, JUMP_HEIGHT));
  }

  handleCollision(tile) {
    BehaviorHelper.faceToward(this.subject, tile);
    Audio.play(Audio.EFFECTS.JUMP_COLLIDE);
    if (tile.hasEntity() && tile.getEntity().isEnemy()) {
      const behavior = this.subject.getBehavior();
      behavior.handleCollision(tile.getEntity());
      return behavior.getState();
    }
    return new BounceState(this.subject);
  }

  pickAnimation() {
    return BehaviorHelper.getDirectionAnimation(this.subject, "jumping_");
  }

  update() {
    const tile = BehaviorHelper.detectCollisions(
      this.subject,
      collisionCondition
    );
    if (tile) {
      return this.handleCollision(tile);
    }
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

function tileLandingPosition(hero, tile) {
  const position = hero.translateToOrigin(tile);
  position.add(new Vector(4, -12));
  return position;
}

function collisionCondition(subject, tile) {
  const graphics = subject.getGraphics();
  return (
    tile.getPosition().y >= graphics.getOutline().rect.y &&
    graphics.outlinesIntersect(tile.getOutline()) &&
    !tile.isWalkable() &&
    !tile.isJumpable()
  );
}
