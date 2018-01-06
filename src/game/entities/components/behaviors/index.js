import BehaviorComponent from "./BehaviorComponent";
import CrestfallenMageBehavior from "../../npcs/crestfallenMage/CrestfallenMageBehavior";
import AnimateSometimesBehavior from "./AnimateSometimesBehavior";
import Tile from "../../../engine/map/Tile";
import NpcBehavior from "../../npcs/behaviors/NpcBehavior";

const behaviors = {
  BaseBehavior: BehaviorComponent,
  AnimateSometimesBehavior,
  CrestfallenMageBehavior,
  NpcBehavior
};

behaviors.create = entity => {
  const name =
    (entity.getProperty(Tile.PROPERTIES.BEHAVIOR) || "Base") + "Behavior";
  if (!behaviors[name]) {
    throw new Error(`BehaviorComponent ${name} does not exist`);
  }
  return new behaviors[name](entity);
};

export default behaviors;
