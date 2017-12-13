import BehaviorComponent from "./BehaviorComponent";
import AnimateSometimesBehavior from "./AnimateSometimesBehavior";
import Tile from "../../../engine/map/Tile";

const behaviors = {
  AnimateSometimesBehavior,
  BaseBehavior: BehaviorComponent
};

behaviors.create = entity => {
  const name =
    (entity.getProperty(Tile.PROPERTIES.BEHAVIOR) || "Base") + "Behavior";
  if (!behaviors[name]) {
    throw new Error(`BehaviorComponent ${name} does not exist`);
  }
  const behavior = new behaviors[name](entity);
  return behavior;
};

export default behaviors;
