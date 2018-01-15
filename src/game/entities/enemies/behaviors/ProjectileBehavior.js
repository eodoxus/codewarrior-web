import Audio from "../../../engine/Audio";
import BehaviorComponent from "../../components/behaviors/BehaviorComponent";
import BehaviorHelper from "../../components/behaviors/BehaviorHelper";
import GameEvent from "../../../engine/GameEvent";
import Tile from "../../../engine/map/Tile";
import ProjectileFactory from "../ProjectileFactory";

export default class ProjectileBehavior extends BehaviorComponent {
  pickAnimation() {
    return this.entity.getProperty(Tile.PROPERTIES.NAME);
  }

  handleEvent(event) {
    const entity = event.getData();
    const isCollisionWithParent = this.entity.getProperty("parent") === entity;
    if (event.getType() === GameEvent.COLLISION && !isCollisionWithParent) {
      ProjectileFactory.destroy(this.entity);
    }
  }

  update() {
    super.update();
    if (BehaviorHelper.detectCollisions(this.entity, collisionCondition)) {
      Audio.play(Audio.EFFECTS.SHATTER);
      return ProjectileFactory.destroy(this.entity);
    }
    if (BehaviorHelper.isOffScreen(this.entity)) {
      ProjectileFactory.remove(this.entity);
    }
  }
}

function collisionCondition(entity, tile) {
  if (tile.isWalkable() || tile.isWater()) {
    return false;
  }
  return entity.getGraphics().outlinesIntersect(tile.getOutline());
}
