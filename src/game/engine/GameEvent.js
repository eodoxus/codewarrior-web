import Event from "../../lib/Event";

const listeners = [];
let inputQueue;

export default class GameEvent extends Event {
  static CANCEL = "cancel";
  static CLICK = "click";
  static CLICK_HERO = "clickHero";
  static CLICK_MENU = "clickMenu";
  static CLOSE_CURTAIN = "closeCurtain";
  static CLOSE_HERO_MENU = "closeHeroMenu";
  static CLOSE_TATTERED_PAGE = "closeTatteredPage";
  static CONFIRM = "confirm";
  static COLLISION = "collision";
  static DIALOG = "dialog";
  static DOORWAY = "doorway";
  static HIDE_BORDER = "hideBorder";
  static NPC_INTERACTION = "npcInteraction";
  static TALK = "talk";
  static TRANSITION = "transition";
  static OPEN_CURTAIN = "openCurtain";
  static OPEN_HERO_MENU = "openHeroMenu";
  static OPEN_TATTERED_PAGE = "openTatteredPage";
  static SHOW_BORDER = "showBorder";
  static STOP = "stop";

  static click(tile) {
    return new EventType(GameEvent.CLICK, tile);
  }

  static generic(eventName, data) {
    return new EventType(eventName, data);
  }

  static collision(entity) {
    return new EventType(GameEvent.COLLISION, entity);
  }

  static heroClick(hero) {
    return new EventType(GameEvent.CLICK_HERO, hero);
  }

  static menuClick(position) {
    return new EventType(GameEvent.CLICK_MENU, position);
  }

  static talk(entity) {
    return new EventType(GameEvent.TALK, entity);
  }

  static removeAllListeners() {
    listeners.forEach(listener => {
      listener.remove();
    });
  }

  static on(event, handler, enqueue = false) {
    const listener = super.on(event, handler);
    if (enqueue) {
      listeners.push(listener);
    }
    return listener;
  }

  static inputQueue(event) {
    if (!inputQueue) {
      inputQueue = new InputQueue();
    }
    return inputQueue;
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

class InputQueue {
  queue;

  constructor() {
    this.queue = [];
  }

  add(event) {
    if (this.queue.length === 0) {
      this.queue.push(event);
      return;
    }
    if (this.queue[this.queue.length - 1].getType() !== event.getType()) {
      this.queue.push(event);
    }
  }

  getNext() {
    if (this.queue.length) {
      return this.queue.pop();
    }
  }
}
