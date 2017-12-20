import React from "react";
import Rect from "../engine/Rect";

export default class MenuItemComponent extends React.Component {
  el;
  listeners;

  componentWillUnmount() {
    this.listeners && this.listeners.forEach(listener => listener.remove());
    delete this.listeners;
  }

  onClick(position) {
    // Override this
  }

  intersects(position) {
    const rect = new Rect(
      this.el.offsetLeft,
      this.el.offsetTop,
      this.el.offsetWidth,
      this.el.offsetHeight
    );
    return rect.intersects(position);
  }

  setEl(el) {
    if (el) {
      this.el = el;
    }
  }
}
