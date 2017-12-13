import BehaviorComponent from "../../components/behaviors/BehaviorComponent";
import CrestfallenMageGraphics from "./CrestfallenMageGraphics";
import Entity from "../../../engine/Entity";
import Size from "../../../engine/Size";
import StoppedState from "./states/StoppedState";
import WalkingState from "./states/WalkingState";

const ANIMATION = "npcs";
const FPS = 10;

export default class CrestfallenMage extends Entity {
  static FPS = 10;
  static ID = "crestfallenMage";

  constructor(id, properties) {
    super(CrestfallenMage.ID, properties);
    this.behavior = new BehaviorComponent(this, WalkingState, StoppedState);
    this.graphics = new CrestfallenMageGraphics(
      this,
      ANIMATION,
      CrestfallenMage.ID,
      new Size(20, 24),
      FPS
    );
  }
}
