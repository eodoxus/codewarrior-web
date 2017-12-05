import Event from "../../lib/Event";

export default class GameEvent extends Event {
  static CLICK = "click";
  static COLLISION = "collision";
  static DIALOG = "dialog";
  static DOORWAY = "doorway";
  static TALK = "talk";
  static TRANSITION = "transition";
  static STOP = "stop";

  static click(tile) {
    return new EventType(GameEvent.CLICK, tile);
  }

  static collision(entity) {
    return new EventType(GameEvent.COLLISION, entity);
  }

  static stop() {
    return new EventType(GameEvent.STOP);
  }

  static talk(entity) {
    return new EventType(GameEvent.TALK, entity);
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
