export default class State {
  static enter() {
    // Override this
    return State;
  }

  static handleInput(subject, input) {
    // Override this
    return State;
  }

  static update(subject, dt) {
    // Override this
    return State;
  }

  static exit() {
    // Override this
    return State;
  }
}
