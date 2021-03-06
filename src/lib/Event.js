import { EventEmitter } from "fbemitter";

export default class Event {
  static CLICK_DEBOUNCE = 100;

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

  static fireAfterClick(event, obj) {
    setTimeout(() => {
      Event.fire(event, obj);
    }, Event.CLICK_DEBOUNCE);
  }

  static on(event, handler) {
    return Event.instance().emitter.addListener(event, handler);
  }

  static once(event, handler) {
    return Event.instance().emitter.once(event, handler);
  }

  emitter;
  constructor() {
    this.emitter = new EventEmitter();
  }
}
