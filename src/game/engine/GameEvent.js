import Event from "../../lib/Event";

const listeners = [];

export default class GameEvent extends Event {
  static CANCEL = "cancel";
  static CLICK = "click";
  static CLOSE_TATTERED_PAGE = "closeTatteredPage";
  static CONFIRM = "confirm";
  static COLLISION = "collision";
  static DIALOG = "dialog";
  static DOORWAY = "doorway";
  static NPC_INTERACTION = "npcInteraction";
  static TALK = "talk";
  static TRANSITION = "transition";
  static OPEN_TATTERED_PAGE = "openTatteredPage";
  static STOP = "stop";

  static click(tile) {
    return new EventType(GameEvent.CLICK, tile);
  }

  static collision(entity) {
    return new EventType(GameEvent.COLLISION, entity);
  }

  static talk(entity) {
    return new EventType(GameEvent.TALK, entity);
  }

  static generic(eventName, data) {
    return new EventType(eventName, data);
  }

  static removeAllListeners() {
    listeners.forEach(listener => {
      listener.remove();
    });
  }

  static on(event, handler, enqueue = true) {
    const listener = super.on(event, handler);
    if (enqueue) {
      listeners.push(listener);
    }
    return listener;
  }
}

class EventType {
  type;
  data;
  constructor(type, data) {
    this.type = type;
    this.data = data;
  }

  getType() {
    return this.type;
  }

  getData() {
    return this.data;
  }
}
