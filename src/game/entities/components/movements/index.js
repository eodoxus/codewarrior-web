import Tile from "../../../engine/map/Tile";
import MovementComponent from "./MovementComponent";
import PacingMovement from "./PacingMovement";
import PathfindingMovement from "./PathfindingMovement";
import PatrollingMovement from "./PatrollingMovement";

const movements = {
  BaseMovement: MovementComponent,
  PacingMovement,
  PathfindingMovement,
  PatrollingMovement
};

movements.create = (entity, position) => {
  const name =
    (entity.getProperty(Tile.PROPERTIES.MOVEMENT) || "Base") + "Movement";
  if (!movements[name]) {
    throw new Error(`MovementComponent ${name} does not exist`);
  }
  return movements[name].create(entity, position);
};

export default movements;
