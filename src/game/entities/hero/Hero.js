import AnimationCollection from "../../engine/AnimationCollection";
import Entity from "../../engine/Entity";
import HeroSprite from "./HeroSprite";
import PathFinder from "../../engine/map/PathFinder";
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
  id = "hero";
  map;
  pathFinder;
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

  getVelocityForState() {
    let v = 0;
    switch (this.state) {
      case Hero.STATES.WALKING:
        v = config.walkingVelocity;
        break;
      case Hero.STATES.RUNNING:
        v = config.runningVelocity;
        break;
      default:
    }
    return new Vector(1, 1).multiply(v);
  }

  randomWalk(dt) {
    if (this.dt + dt > 2000) {
      const randX = Math.random();
      const randY = Math.random();
      this.state = randX >= 0.5 ? Hero.STATES.RUNNING : Hero.STATES.WALKING;
      this.velocity = this.getVelocityForState();

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
    this.pathFinder = new PathFinder(this.map);
  }

  setPosition(position) {
    super.setPosition(this.translateToOrigin(position));
  }

  update(dt) {
    //this.randomWalk(dt);
    if (!this.velocity) {
      return;
    }

    super.update(dt);

    if (this.velocity.magnitude() !== 0) {
      this.sprite.updateCurrentAnimation(this.state, this.velocity);
    }

    const animation = this.sprite.getAnimation();
    if (this.velocity.magnitude() === 0) {
      animation && animation.reset();
    } else {
      animation && animation.update(dt);
    }

    if (
      this.state === Hero.STATES.WALKING ||
      this.state === Hero.STATES.RUNNING
    ) {
      if (!this.currentMove) {
        this.walkToNextStep();

        if (this.velocity.magnitude() === 0) {
          this.state = Hero.STATES.STOPPED;
        }
      }
    }
  }

  walkTo(tile) {
    this.state = Hero.STATES.WALKING;
    super.walkTo(tile);
  }
}
