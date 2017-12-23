import Entity from "../../engine/Entity";
import HeroApi from "./HeroApi";
import HeroBehavior from "./HeroBehavior";
import HeroGraphics from "./HeroGraphics";
import GameEvent from "../../engine/GameEvent";
import PathfindingMovement from "../components/movements/PathfindingMovement";
import Vector from "../../engine/Vector";

export default class Hero extends Entity {
  static ID = "hero";

  constructor() {
    super(Hero.ID);
    this.movement = new PathfindingMovement(this);
    this.behavior = new HeroBehavior(this);
    this.graphics = new HeroGraphics(this);
    Entity.makeActor(this);
    this.spawn(new Vector(0, 0), new Vector(0, 1));
  }

  getApi() {
    return new HeroApi(this);
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
