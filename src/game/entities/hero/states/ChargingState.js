import Audio from "../../../engine/Audio";
import BounceState from "./BounceState";
import BehaviorHelper from "../../components/behaviors/BehaviorHelper";
import GameEvent from "../../../engine/GameEvent";
import State from "../../../engine/State";
import Vector from "../../../engine/Vector";
import WalkingState from "./WalkingState";

const SOUND_EFFECT_DURATION = 160;
const VELOCITY = 160;

export default class ChargingState extends State {
  soundEffectInterval;

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
    BehaviorHelper.faceToward(this.subject, tile);
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
    const tile = BehaviorHelper.detectCollisions(this.subject);
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
