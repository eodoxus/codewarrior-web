import React from "react";
import Rect from "../engine/Rect";

export default class MenuComponent extends React.Component {
  el;
  listeners;
  rect;

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  componentWillUnmount() {
    this.listeners && this.listeners.forEach(listener => listener.remove());
    delete this.listeners;
  }

  onClose = e => {
    if (!this.isOpen()) {
      return;
    }
    this.setState({ isOpen: false });
  };

  onClick(position) {
    // Override this
  }

  onOpen = () => {
    if (this.isOpen()) {
      return;
    }
    this.setState({ isOpen: true });
  };

  intersects(position) {
    if (!this.isOpen()) {
      return false;
    }
    const rect = new Rect(
      this.el.offsetLeft,
      this.el.offsetTop,
      this.el.offsetWidth,
      this.el.offsetHeight
    );
    return rect.intersects(position);
  }

  isOpen() {
    return this.state.isOpen;
  }

  translateToCoordinateSpace(position) {
    position.x -= this.el.offsetLeft;
    position.y -= this.el.offsetTop;
    return position;
  }
}
