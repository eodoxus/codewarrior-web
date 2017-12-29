export default class State {
  constructor(subject) {
    if (subject) {
      const state = subject.getBehavior().getState();
      state && state.exit(subject);
    }
    this.enter(...arguments);
  }

  enter(subject) {
    // Override this
    return this;
  }

  exit(subject) {
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
