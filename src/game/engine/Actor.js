import Dialog from "./Dialog";
import Entity from "./Entity";
import Tile from "./map/Tile";

export default class Actor extends Entity {
  dialog;
  intent;

  getDialog() {
    return this.dialog;
  }

  setDialog(dialog) {
    this.dialog = dialog;
  }

  fulfillIntent() {
    setTimeout(() => delete this.intent);
  }

  getIntent() {
    return this.intent;
  }

  hasIntent() {
    return !!this.intent;
  }

  isIntent(type) {
    return this.intent && this.intent.getType(type);
  }

  setIntent(intent) {
    this.intent = intent;
  }

  setProperties(properties) {
    super.setProperties(properties);
    if (this.properties[Tile.PROPERTIES.DIALOG]) {
      this.dialog = new Dialog(this.properties[Tile.PROPERTIES.DIALOG]);
    }
  }

  intersectsEntity(entity) {
    if (!this.getRect().intersects(entity.getRect())) {
      return false;
    }
    if (this.isNpc() || (entity.isNpc && entity.isNpc())) {
      return true;
    }
    return this.outlinesIntersect(entity.getOutline());
  }
}
