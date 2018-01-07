import AnimatedSpriteGraphics from "../components/graphics/AnimatedSpriteGraphics";
import Audio from "../../engine/Audio";
import Entity from "../../engine/Entity";
import GameEvent from "../../engine/GameEvent";
import HeroApi from "./HeroApi";
import HeroHud from "./HeroHud";
import HeroBehavior from "./HeroBehavior";
import HeroInventory from "./HeroInventory";
import PathfindingMovement from "../components/movements/PathfindingMovement";
import Size from "../../engine/Size";
import Vector from "../../engine/Vector";

const ANIMATION = "hero";
const FPS = 15;
const STARTING_HEALTH = 12;
const STARTING_MAGIC = 0;

export default class Hero extends Entity {
  static ID = "hero";

  experiences = {};
  hud;
  inventory;

  constructor() {
    super(Hero.ID);
    this.movement = new PathfindingMovement(this);
    this.behavior = new HeroBehavior(this);
    this.graphics = new AnimatedSpriteGraphics(
      this,
      ANIMATION,
      new Size(24, 32),
      FPS
    );
    Entity.makeActor(this);
    Entity.makeEnemy(this);
    this.spawn(new Vector(0, 0), new Vector(0, 1));
    this.inventory = new HeroInventory();
    this.setHealth(STARTING_HEALTH);
    this.setMagic(STARTING_MAGIC);
    this.hud = new HeroHud(this);
  }

  die() {
    super.die();
    this.health = 0;
    this.magic = 0;
    Audio.play(Audio.EFFECTS.DIE);
    GameEvent.fire(GameEvent.HERO_DEATH);
  }

  fulfillExperience(experienceName) {
    this.experiences[experienceName] = true;
  }

  getApi() {
    return new HeroApi(this);
  }

  getDefaultSpawnPoint() {
    const map = this.movement.getMap();
    if (map) {
      return map.getHeroSpawnPoint();
    }
    return new Vector();
  }

  getExperiences() {
    return this.experiences;
  }

  getExperienceStatus(experienceName) {
    return this.experiences[experienceName];
  }

  getInventory() {
    return this.inventory;
  }

  async init() {
    await Entity.prototype.init.call(this);
    return this.hud.init();
  }

  render() {
    this.graphics.render();
    this.hud.render();
  }

  spawn(position, orientation) {
    const spawnPosition = position || this.getDefaultSpawnPoint();
    if (spawnPosition) {
      this.movement.setPosition(spawnPosition);
    }
    if (orientation) {
      this.movement.setOrientation(orientation);
    }
    this.graphics.stop();
  }
}
