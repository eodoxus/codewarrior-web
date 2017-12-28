import Dialog from "../../engine/Dialog";
import Entity from "../../engine/Entity";
import GameEvent from "../../engine/GameEvent";
import Tile from "../../engine/map/Tile";

export default class Hint extends Entity {
  dialog;

  constructor(id, properties) {
    super(id, properties);
    this.dialog = new Dialog(properties[Tile.PROPERTIES.DIALOG]);
  }

  handleEvent(event) {
    if (this.isEventCollisionWithHero(event)) {
      GameEvent.fire(GameEvent.DIALOG, this.dialog.getMessage());
    }
  }

  isEventCollisionWithHero(event) {
    if (event.getType() !== GameEvent.COLLISION) {
      return false;
    }

    const entity = event.getData();
    if (!entity.isHero()) {
      return false;
    }

    return true;
  }
}
