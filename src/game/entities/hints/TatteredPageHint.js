import GameEvent from "../../engine/GameEvent";
import Hint from "./Hint";
import TatteredPage from "../items/TatteredPage";

export default class TatteredPageHint extends Hint {
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
