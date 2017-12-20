import React from "react";

export default class MenuItemComponent extends React.Component {
  listeners;

  componentWillUnmount() {
    this.listeners && this.listeners.forEach(listener => listener.remove());
    delete this.listeners;
  }

  onClick(e) {
    // Override this
  }
}
