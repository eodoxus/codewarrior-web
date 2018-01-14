import Audio from "../../../engine/Audio";
import BounceState from "./BounceState";
import State from "../../../engine/State";
import Vector from "../../../engine/Vector";
import WalkingState from "./WalkingState";
import GameEvent from "../../../engine/GameEvent";

const SOUND_EFFECT_DURATION = 160;
const VELOCITY = 160;

export default class ChargingState extends State {
  soundEffectInterval;

  detectCollisions() {
    const graphics = this.subject.getGraphics();
    const layers = this.subject.getMap().getLayers();
    for (let iDx = 0; iDx < layers.length; iDx++) {
      const tiles = layers[iDx].getTiles();
      for (let jDx = 0; jDx < tiles.length; jDx++) {
        const tile = tiles[jDx];
        if (
          graphics.outlinesIntersect(tile.getOutline()) &&
          !tile.isWalkable()
        ) {
          return tile;
        }
      }
    }
  }

  enter(tile) {
    Audio.play(Audio.EFFECTS.RUNNING);
    this.soundEffectInterval = setInterval(
      () => Audio.play(Audio.EFFECTS.RUNNING),
      SOUND_EFFECT_DURATION
    );
    this.subject.setVelocity(new Vector(VELOCITY, VELOCITY));
    this.subject.getMovement().moveTo(this.subject.translateToOrigin(tile));
  }

  exit() {
    clearInterval(this.soundEffectInterval);
  }

  handleCollision(tile) {
    const movement = this.subject.getMovement();
    const facingDirection = getFaceTowardDirection(this.subject, tile);
    movement.setOrientation(facingDirection);
    Audio.play(Audio.EFFECTS.CRASH);
    if (tile.hasEntity()) {
      tile.getEntity().handleEvent(new GameEvent.collision(this.subject));
    }
    return new BounceState(this.subject);
  }

  pickAnimation() {
    return WalkingState.getAnimationFor(this.subject);
  }

  update() {
    const tile = this.detectCollisions();
    if (tile) {
      return this.handleCollision(tile);
    }
    if (!this.subject.getMovement().isMoving()) {
      return new WalkingState(this.subject);
    }
    this.subject.getGraphics().start();
    return this;
  }
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
