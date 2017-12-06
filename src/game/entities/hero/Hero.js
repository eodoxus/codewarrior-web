import AnimatedSprite from "../../engine/AnimatedSprite";
import GameEvent from "../../engine/GameEvent";
import PathfindingActor from "../../engine/PathfindingActor";
import Size from "../../engine/Size";
import StoppedState from "./states/StoppedState";
import WalkingState from "./states/WalkingState";

export default class Hero extends PathfindingActor {
  static FPS = 20;
  static ID = "hero";

  constructor() {
    super(Hero.ID);
    this.sprite = new AnimatedSprite(Hero.ID, new Size(24, 32), Hero.FPS);
    this.state = new StoppedState(this);
    this.zIndex = 1;
  }

  handleCollision(entity) {
    this.state = this.state.handleInput(this, GameEvent.collision(entity));
  }

  setPosition(position) {
    super.setPosition(this.translateToOrigin(position));
  }

  spawn(position, direction) {
    const spawnPosition = position || this.map.getHeroSpawnPoint();
    if (spawnPosition) {
      this.setPosition(spawnPosition);
    }
    if (direction) {
      this.updateDirection(direction);
    }
  }

  stop() {
    super.stop();
    this.state = new StoppedState(this);
  }

  update(dt) {
    super.update(dt);
    this.state = this.state.update(this);
    this.sprite.getAnimation().update(dt);
  }

  updateDirection(direction) {
    this.setVelocity(direction);
    this.state = new WalkingState(this);
  }
}
