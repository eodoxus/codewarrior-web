export default class Action {
  entity;

  constructor(entity) {
    this.entity = entity;
  }

  execute() {
    // Override this
  }

  finish() {
    // Override this
  }
}
