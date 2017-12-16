import State from "../../../engine/State";

export default class BehaviorComponent {
  entity;
  intent;
  state;
  startState;
  stopState;

  constructor(entity, startState = State, stopState = State) {
    this.entity = entity;
    this.startState = startState;
    this.stopState = stopState;
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

  getState() {
    return this.state;
  }

  setState(state) {
    this.state = state;
  }

  handleEvent(event) {
    this.state = this.state.handleEvent(this.entity, event);
  }

  start() {
    this.state = new this.startState(this.entity);
  }

  stop() {
    this.state = new this.stopState(this.entity);
  }

  update() {
    this.state = this.state.update(this.entity);
    this.entity.movement.update();
    this.entity.graphics.update();
  }
}
