import Tile from "../../../engine/map/Tile";
import MovementComponent from "./MovementComponent";
import PacingMovement from "./PacingMovement";
import PathfindingMovement from "./PathfindingMovement";
import StaticMovement from "./StaticMovement";
import Vector from "../../../engine/Vector";

const movements = {
  PacingMovement,
  PathfindingMovement,
  StaticMovement,
  BaseMovement: MovementComponent
};

movements.create = (entity, position) => {
  const name =
    (entity.getProperty(Tile.PROPERTIES.MOVEMENT) || "Base") + "Movement";
  if (!movements[name]) {
    throw new Error(`MovementComponent ${name} does not exist`);
  }

  switch (name) {
    case "StaticMovement":
      return new StaticMovement(entity, new Vector(), position);
    default:
      return new movements[name](entity);
  }
};

export default movements;
