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
  detectCollisions(hero) {
    const graphics = hero.getGraphics();
    const outline = graphics.getOutline();
    const layers = hero.getMap().getLayers();
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

  enter(hero, tile) {
    Audio.play(Audio.EFFECTS.JUMP);
    startJump(hero, tile);
  }

  handleCollision(hero, tile) {
    const movement = hero.getMovement();
    const facingDirection = getFaceTowardDirection(hero, tile);
    movement.setOrientation(facingDirection);
    Audio.play(Audio.EFFECTS.JUMP_COLLIDE);
    return new BounceState(hero);
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
    const tile = this.detectCollisions(hero);
    if (tile) {
      return this.handleCollision(hero, tile);
    }
    if (!hero.getMovement().isMoving()) {
      return endJump(hero);
    }
    hero
      .getGraphics()
      .getSprite()
      .setAnimation(this.pickAnimation(hero));
    return this;
  }
}

function endJump(hero) {
  hero.getGraphics().toggleShadow(false);
  hero.getPosition().add(new Vector(0, JUMP_HEIGHT));
  return new WalkingState(hero);
}

function startJump(hero, tile) {
  hero.getGraphics().toggleShadow();
  hero.setVelocity(new Vector(VELOCITY, VELOCITY));
  hero.getMovement().moveTo(tileLandingPosition(hero, tile));
  hero.getPosition().subtract(new Vector(0, JUMP_HEIGHT));
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
