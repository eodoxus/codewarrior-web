import AnimatedSprite from "../../engine/AnimatedSprite";
import Size from "../../engine/Size";
import StoppedState from "./states/StoppedState";
import WalkingEntity from "../../engine/WalkingEntity";
import WalkingState from "./states/WalkingState";

export default class Hero extends WalkingEntity {
  static FPS = 20;
  static ID = "hero";

  constructor() {
    super(Hero.ID);
    this.sprite = new AnimatedSprite(Hero.ID, new Size(24, 32), Hero.FPS);
    this.state = StoppedState.enter(this);
    this.zIndex = 1;
  }

  handleCollision(entity) {
    if (entity.isNpc()) {
      this.reroute();
    }
  }

  setPosition(position) {
    super.setPosition(this.translateToOrigin(position));
  }

  spawn(position, direction) {
    this.setPosition(position || this.map.getHeroSpawnPoint());
    if (direction) {
      this.updateDirection(direction);
    }
  }

  stop() {
    super.stop();
    this.state = StoppedState.enter(this);
  }

  update(dt) {
    super.update(dt);
    this.state = this.state.update(this);
    this.sprite.getAnimation().update(dt);
  }

  updateDirection(direction) {
    this.setVelocity(direction);
    this.state = WalkingState.enter(this);
  }
}
