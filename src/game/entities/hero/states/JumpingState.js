import Audio from "../../../engine/Audio";
import BounceState from "./BounceState";
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
const VELOCITY = 80;

export default class JumpingState extends State {
  detectCollisions() {
    const graphics = this.subject.getGraphics();
    const outline = graphics.getOutline();
    const layers = this.subject.getMap().getLayers();
    for (let iDx = 0; iDx < layers.length; iDx++) {
      const tiles = layers[iDx].getTiles();
      for (let jDx = 0; jDx < tiles.length; jDx++) {
        const tile = tiles[jDx];
        if (
          tile.getPosition().y >= outline.rect.y &&
          graphics.outlinesIntersect(tile.getOutline()) &&
          !tile.isWalkable() &&
          !tile.isJumpable()
        ) {
          return tile;
        }
      }
    }
  }

  enter(tile) {
    Audio.playEffect(Audio.EFFECTS.JUMP);
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
    const movement = this.subject.getMovement();
    const facingDirection = getFaceTowardDirection(this.subject, tile);
    movement.setOrientation(facingDirection);
    Audio.playEffect(Audio.EFFECTS.JUMP_COLLIDE);
    return new BounceState(this.subject);
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
    const tile = this.detectCollisions();
    if (tile) {
      return this.handleCollision(tile);
    }
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

function tileLandingPosition(hero, tile) {
  const position = hero.translateToOrigin(tile);
  position.add(new Vector(4, -12));
  return position;
}

function getFaceTowardDirection(hero, tile) {
  const distance = hero.getOrigin().distanceTo(tile.getOrigin());

  // If the y distance is greater than x distance
  // it's either above or below, otherwise it's
  // either left or right
  if (Math.abs(distance.y) >= Math.abs(distance.x)) {
    // If it's above, face up
    if (distance.y > 0) {
      return new Vector(0, -1);
    }
    // Otherwise, it's below, face down
    return new Vector(0, 1);
  } else {
    // If it's to the right, face right
    if (distance.x < 0) {
      return new Vector(1, 0);
    }
    // Otherwise, it's to the left, face left
    return new Vector(-1, 0);
  }
}
