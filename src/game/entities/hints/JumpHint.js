import GameEvent from "../../engine/GameEvent";
import Hint from "./Hint";
import TatteredPage from "../items/TatteredPage";

export default class JumpHint extends Hint {
  static ID = "hint";

  constructor(id, properties) {
    super(id, properties);
    this.id = JumpHint.ID;
  }

  handleEvent(event) {
    if (!this.isEventCollisionWithHero(event)) {
      return;
    }

    const entity = event.getData();
    if (!entity.getInventory().has(TatteredPage.NAME)) {
      return;
    }

    this.dialog.setState(0);
    GameEvent.fire(GameEvent.DIALOG, this.dialog.getMessage());
  }
}
