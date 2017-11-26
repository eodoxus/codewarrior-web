import { EventEmitter } from "fbemitter";

export default class Event {
  static TRANSITION = "transition";

  static _instance;
  static instance() {
    if (!Event._instance) {
      Event._instance = new Event();
    }
    return Event._instance;
  }

  static fire(event, obj) {
    Event.instance().emitter.emit(event, obj);
  }

  static on(event, handler) {
    Event.instance().emitter.addListener(event, handler);
  }

  emitter;
  constructor() {
    this.emitter = new EventEmitter();
  }
}
