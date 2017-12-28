export default class State {
  constructor(entity) {
    if (entity) {
      const state = entity.getBehavior().getState();
      state && state.exit();
    }
    this.enter(...arguments);
  }

  enter() {
    // Override this
    return this;
  }

  exit() {
    // Override this
    return this;
  }

  handleEvent(subject, input) {
    // Override this
    return this;
  }

  pickAnimation(subject) {
    // Override this
    return this;
  }

  update(subject, dt) {
    // Override this
    return this;
  }
}
