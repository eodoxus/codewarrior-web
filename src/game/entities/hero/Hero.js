import AnimatedSpriteGraphics from "../components/graphics/AnimatedSpriteGraphics";
import Entity from "../../engine/Entity";
import HeroApi from "./HeroApi";
import HeroBehavior from "./HeroBehavior";
import HeroInventory from "./HeroInventory";
import GameEvent from "../../engine/GameEvent";
import PathfindingMovement from "../components/movements/PathfindingMovement";
import Size from "../../engine/Size";
import Vector from "../../engine/Vector";

const ANIMATION = "hero";
const FPS = 15;

export default class Hero extends Entity {
  static ID = "hero";

  experiences = {};
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
    this.spawn(new Vector(0, 0), new Vector(0, 1));
    this.inventory = new HeroInventory();
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

  render() {
    let outline = this.graphics.getSprite().getOutline();
    const canModifyOutline = !!!outline;
    this.graphics.render();

    // Hero's outline is to big because the sample sprite is too big,
    // so downsize it a tad.
    if (canModifyOutline) {
      outline = this.graphics.getSprite().getOutline();
      outline.min += 1;
      outline.max -= 5;
    }
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

  update() {
    super.update();

    const map = this.movement.getMap();
    const tile = map && map.getTileAt(this.getOrigin());
    if (tile && tile.isDoorway()) {
      return GameEvent.fire(GameEvent.DOORWAY, tile);
    }
  }
}
