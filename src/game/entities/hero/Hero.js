import AnimationCollection from "../../engine/AnimationCollection";
import Entity from "../../engine/Entity";
import HeroSprite from "./HeroSprite";
import Size from "../../engine/Size";
import Vector from "../../engine/Vector";
import config from "./config";

export default class Hero extends Entity {
  static STATES = {
    STOPPED: 0,
    PICKING_UP: 1,
    READING: 2,
    RUNNING: 3,
    WALKING: 4
  };

  config;
  map;
  sprite;
  state;

  constructor() {
    super();
    this.sprite = new HeroSprite(
      new Size(
        config.width || this.size.width,
        config.height || this.size.height
      ),
      new AnimationCollection(config.animations || {})
    );
    this.state = Hero.STATES.STOPPED;
    this.velocity = new Vector(0, 0); // Down
    this.sprite.updateCurrentAnimation(this.state, this.velocity);
  }

  getWalkingVelocity() {
    const v = new Vector(1, 1);
    v.multiply(
      this.state === Hero.STATES.WALKING
        ? config.walkingVelocity
        : config.runningVelocity
    );
    return v;
  }

  randomWalk(dt) {
    if (this.dt + dt > 2000) {
      const randX = Math.random();
      const randY = Math.random();
      this.state = randX >= 0.5 ? Hero.STATES.RUNNING : Hero.STATES.WALKING;
      this.velocity = this.getWalkingVelocity();

      if (randX < 0.3) {
        this.velocity.x *= -1;
      } else if (randX < 0.6) {
        this.velocity.x = 0;
      }
      if (randY < 0.3) {
        this.velocity.y *= -1;
      } else if (randY < 0.6) {
        this.velocity.y = 0;
      }

      this.dt = 0;
    }
  }

  setMap(map) {
    this.map = map;
  }

  update(dt) {
    this.randomWalk(dt);
    if (this.velocity.magnitude() !== 0) {
      this.sprite.updateCurrentAnimation(this.state, this.velocity);
    }
    const animation = this.sprite.getAnimation();
    if (!this.velocity || this.velocity.magnitude() === 0) {
      animation && animation.reset();
    } else {
      animation && animation.update(dt);
    }

    super.update(dt);
  }
}
