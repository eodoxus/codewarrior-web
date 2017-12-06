export default class State {
  constructor() {
    this.enter(...arguments);
  }

  enter() {
    // Override this
    return this;
  }

  handleInput(subject, input) {
    // Override this
    return this;
  }

  update(subject, dt) {
    // Override this
    return this;
  }

  exit() {
    // Override this
    return this;
  }
}
