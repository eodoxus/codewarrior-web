import BehaviorComponent from "../../components/behaviors/BehaviorComponent";
import BehaviorHelper from "../../components/behaviors/BehaviorHelper";
import FairyFactory from "../FairyFactory";
import GameEvent from "../../../engine/GameEvent";
import Time from "../../../engine/Time";
import Vector from "../../../engine/Vector";

const ANIMATIONS = {
  LEFT: "left",
  RIGHT: "right"
};
const HEAL_POINTS = 12;
const LIFETIME = Time.SECOND * 10;
const MOVEMENT_DURATION = Time.SECOND * 2;
const VELOCITY = 10;

export default class FairyBehavior extends BehaviorComponent {
  static getRandomVelocity() {
    return new Vector(
      Math.random() > 0.5 ? VELOCITY : -VELOCITY,
      Math.random() > 0.5 ? VELOCITY : -VELOCITY
    );
  }

  lifeTimer;
  movementTimer;

  constructor(entity) {
    super(entity);
    this.lifeTimer = Time.timer();
    this.movementTimer = Time.timer();
  }

  pickAnimation() {
    const velocity = this.entity.getVelocity();
    return "fairy_" + (velocity.x < 0 ? ANIMATIONS.LEFT : ANIMATIONS.RIGHT);
  }

  handleEvent(event) {
    const entity = event.getData();
    if (event.getType() === GameEvent.COLLISION && entity.isHero()) {
      entity.heal(HEAL_POINTS);
      FairyFactory.remove(this.entity);
    }
  }

  update() {
    if (this.movementTimer.elapsed() >= MOVEMENT_DURATION) {
      this.entity.setVelocity(FairyBehavior.getRandomVelocity());
      this.entity.getGraphics().stop();
      this.entity.getGraphics().start();
      this.movementTimer.reset();
    }

    super.update();

    if (this.lifeTimer.elapsed() >= LIFETIME) {
      return FairyFactory.remove(this.entity);
    }
    if (BehaviorHelper.isOffScreen(this.entity)) {
      FairyFactory.remove(this.entity);
    }
  }
}
