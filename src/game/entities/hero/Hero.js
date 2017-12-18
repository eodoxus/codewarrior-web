import Entity from "../../engine/Entity";
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

  spawn(position, orientation) {
    const spawnPosition =
      position || this.movement.getMap().getHeroSpawnPoint();
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
