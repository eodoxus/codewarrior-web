import CrestfallenMageBehavior from "./CrestfallenMageBehavior";
import CrestfallenMageGraphics from "./CrestfallenMageGraphics";
import Entity from "../../../engine/Entity";

export default class CrestfallenMage extends Entity {
  static ID = "crestfallenMage";

  constructor(id, properties) {
    super(CrestfallenMage.ID, properties);
    this.behavior = new CrestfallenMageBehavior(this);
    this.graphics = new CrestfallenMageGraphics(this);
  }
}
