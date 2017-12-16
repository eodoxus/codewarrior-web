export default class AnimateSometimesBehavior {
  entity;

  constructor(entity) {
    this.entity = entity;
  }

  hasIntent() {
    return false;
  }

  isIntent() {
    return false;
  }

  handleEvent(event) {
    // Do nothing
  }

  start() {}

  stop() {}

  update() {
    this.entity.movement.update();
    if (Math.random() > 0.5) {
      this.entity.graphics.update();
    }
  }
}
