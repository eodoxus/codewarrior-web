import BehaviorComponent from "../../components/behaviors/BehaviorComponent";
import CrestfallenMageGraphics from "./CrestfallenMageGraphics";
import Entity from "../../../engine/Entity";
import PacingMovement from "../../components/movements/PacingMovement";
import Size from "../../../engine/Size";
import StoppedState from "./states/StoppedState";
import Vector from "../../../engine/Vector";
import WalkingState from "./states/WalkingState";

const ANIMATION = "npcs";
const DISTANCE = 40;
const FPS = 10;
const VELOCITY = 10;

export default class CrestfallenMage extends Entity {
  static FPS = 10;
  static ID = "crestfallenMage";

  constructor(id, properties, position) {
    super(CrestfallenMage.ID, properties);
    this.behavior = new BehaviorComponent(this, WalkingState, StoppedState);
    this.graphics = new CrestfallenMageGraphics(
      this,
      ANIMATION,
      CrestfallenMage.ID,
      new Size(20, 24),
      FPS
    );

    const orientation = new Vector(1, 0);
    const endPosition = Vector.copy(position);
    endPosition.x += DISTANCE;
    const velocity = new Vector(VELOCITY, 0);
    this.movement = new PacingMovement(
      this,
      orientation,
      position,
      endPosition,
      velocity
    );

    Entity.makeActor(this);
  }
}
