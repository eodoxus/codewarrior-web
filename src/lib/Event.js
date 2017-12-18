import { EventEmitter } from "fbemitter";

export default class Event {
  static _instance;
  static instance() {
    if (!Event._instance) {
      Event._instance = new Event();
    }
    return Event._instance;
  }

  static absorbClick(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  static fire(event, obj) {
    return Event.instance().emitter.emit(event, obj);
  }

  static on(event, handler) {
    return Event.instance().emitter.addListener(event, handler);
  }

  emitter;
  constructor() {
    this.emitter = new EventEmitter();
  }
}
