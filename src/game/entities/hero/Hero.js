import BehaviorComponent from "../components/behaviors/BehaviorComponent";
import Entity from "../../engine/Entity";
import HeroGraphics from "./HeroGraphics";
import PathfindingMovement from "../components/movements/PathfindingMovement";
import StoppedState from "./states/StoppedState";
import Vector from "../../engine/Vector";

export default class Hero extends Entity {
  static ID = "hero";

  constructor() {
    super(Hero.ID);
    this.movement = new PathfindingMovement(this);
    this.behavior = new BehaviorComponent(this, StoppedState, StoppedState);
    this.graphics = new HeroGraphics(this);
    Entity.makeActor(this);
    this.zIndex = 1;
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
}
