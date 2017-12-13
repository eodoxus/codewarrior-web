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

  update(dt) {
    this.entity.movement.update(dt);
    if (Math.random() > 0.5) {
      this.entity.graphics.update(dt);
    }
  }
}
