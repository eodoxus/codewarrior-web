import State from "../../../engine/State";

const SCENE_SELECTOR = "scene";
const MENU_ITEM_SELECTOR = "menu-item";
const POINTER_CURSOR = "pointer";
const TARGET_CURSOR = "crosshair";

export default class PickingState extends State {
  target;

  enter() {
    changeCursorTo(TARGET_CURSOR);
    return this;
  }

  async getTarget() {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (this.target) {
          changeCursorTo(POINTER_CURSOR);
          clearInterval(interval);
          resolve(this.target);
        }
      });
    });
  }

  setTarget(position) {
    this.target = position;
  }
}

function changeCursorTo(cursor) {
  document.getElementById(SCENE_SELECTOR).style.cursor = cursor;
  const els = document.getElementsByClassName(MENU_ITEM_SELECTOR);
  Array.prototype.forEach.call(els, el => (el.style.cursor = cursor));
}
