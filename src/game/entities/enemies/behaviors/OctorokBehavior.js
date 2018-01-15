import EnemyBehavior from "./EnemyBehavior";
import ProjectileFactory from "../ProjectileFactory";
import ShootingState from "./states/ShootingState";
import Time from "../../../engine/Time";
import Vector from "../../../engine/Vector";

const SHOOT_INTERVAL = Time.SECOND * 4;

export default class OctorokBehavior extends EnemyBehavior {
  timer;

  constructor(entity) {
    super(entity);
    this.timer = Time.timer();
  }

  createProjectile() {
    const position = Vector.copy(this.entity.getPosition()).add(
      new Vector(4, 10)
    );
    return ProjectileFactory.create("octorokBullet", this.entity, position);
  }

  update() {
    if (this.timer.elapsed() >= SHOOT_INTERVAL) {
      this.state = new ShootingState(this.entity);
      this.timer.reset();
    }
    super.update();
  }
}
