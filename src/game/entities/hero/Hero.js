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
const Z_INDEX = 1;

export default class Hero extends Entity {
  static ID = "hero";

  inventory;

  constructor() {
    super(Hero.ID);
    this.movement = new PathfindingMovement(this);
    this.behavior = new HeroBehavior(this);
    this.graphics = new AnimatedSpriteGraphics(
      this,
      ANIMATION,
      new Size(24, 32),
      FPS,
      Z_INDEX
    );
    Entity.makeActor(this);
    this.spawn(new Vector(0, 0), new Vector(0, 1));
    this.inventory = new HeroInventory();
  }

  getApi() {
    return new HeroApi(this);
  }

  getInventory() {
    return this.inventory;
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

  getDefaultSpawnPoint() {
    const map = this.movement.getMap();
    if (map) {
      return map.getHeroSpawnPoint();
    }
    return new Vector();
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
