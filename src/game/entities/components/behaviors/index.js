import BehaviorComponent from "./BehaviorComponent";
import AnimateSometimesBehavior from "./AnimateSometimesBehavior";
import EnemyBehavior from "../../enemies/behaviors/EnemyBehavior";
import FairyBehavior from "../../items/behaviors/FairyBehavior";
import NpcBehavior from "../../npcs/behaviors/NpcBehavior";
import OctorokBehavior from "../../enemies/behaviors/OctorokBehavior";
import ProjectileBehavior from "../../enemies/behaviors/ProjectileBehavior";
import Tile from "../../../engine/map/Tile";

const behaviors = {
  BaseBehavior: BehaviorComponent,
  AnimateSometimesBehavior,
  EnemyBehavior,
  FairyBehavior,
  NpcBehavior,
  OctorokBehavior,
  ProjectileBehavior
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
