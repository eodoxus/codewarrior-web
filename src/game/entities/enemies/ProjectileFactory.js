import entities from "../index";
import GameEvent from "../../engine/GameEvent";
import GameState from "../../GameState";
import ShatterFactory from "../items/ShatterFactory";
import Vector from "../../engine/Vector";

const VELOCITY = 80;

export default class ProjectileFactory {
  static async create(name, entity, position) {
    const projectile = entities.create(position, {
      name,
      parent: entity,
      graphics: "AnimatedSprite",
      animation: "items",
      enemy: "true",
      fps: "10",
      width: "10",
      height: "15",
      behavior: "Projectile",
      breakable: "true"
    });
    projectile.isWalkable = () => true;
    projectile.setMap(entity.getMap());
    const velocity = Vector.subtract(
      GameState.getHero().getOrigin(),
      entity.getOrigin()
    );
    velocity.normalize();
    velocity.multiply(VELOCITY);
    projectile.setVelocity(velocity);
    await projectile.init();
    projectile.getGraphics().start();
    GameEvent.fire(GameEvent.ADD_ENTITY, projectile);
    return projectile;
  }

  static destroy(entity) {
    entity.kill();
    ShatterFactory.create(entity);
    ProjectileFactory.remove(entity);
  }

  static remove(entity) {
    GameEvent.fire(GameEvent.REMOVE_ENTITY, entity);
  }
}
